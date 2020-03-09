import React, { useEffect, memo, forwardRef, useImperativeHandle, useRef, useState } from "react";
import anime from 'animejs';
import LinkedListNode from './LinkedListNode';
import LinkedListPointer from './LinkedListPointer';

/*
MVP TODOS:
- Data in linkedListNode is not centered if only 1 character
- pointer names are not always centered
- setPointerToNext uses 90px, it was 100px before but that made it too big. It looks right, but should probably figure out the exact right length

HOPEFUL MVP TODOS:
- How to handle two pointers on the same node at once (see insert at tail). Worst case we can just ignore these
- Add "highlight" animation that can highlight certain things by following a path.
    - Parameters: Array (of any size) of highlightables (nodeID, nextPointerID, dataID, pointerID(such as curr/head))
- Make next Pointers arrows instead of lines
- Make LinkedListPointers (these are like "head" and "curr") arrows instead of lines
- Make pointers point to the "Node" part instead of just somewhere random on the box
     - We might want to move the head/curr pointers to the top (and maybe have new nodes come from bottom?)
- Firefox and Safari are completely broken spacing - Maybe issue with how we use vh?
- We need a way to have a pointer point to a non-inserted node.
      - Example: Node temp = new Node(1); This calls NewNode then we need to point temp to it, but its not inserted yet

LATER TODOS:
- Insert Node in Middle of List, see insertNodeAtIndex()
- Reverse doesn't work. Spent a long time on this one, probably not worth the effort right now.
*/

/**
  * Required Props:
  * animations {String[]} – Array of Animation strings as defined below
  * updateLine {Function} - Callback run to update the line number of parent
  * preStartAnimations {String[]} – Array of Animation strings as defined below to have complete before the animation starts
  *
  * Animation strings are comma seperated values. The first value is the name of the function to be called.
  * Other values correspond to arguments to the functions, always as strings.
  * Below is a list of all possible animation string function names and their parameters.
  *
  *  createNewNode:
  *           parameter1 OPTIONAL: data - defaults its node number
  *           parameter2 OPTIONAL: Node ID - defaults to next available
  *           Example: "createNewNode,4,#node3"
  *
  *  createNewPointer:
  *           parameter1: Pointer ID
  *           parameter2: Display name
  *           Example: "createNewPointer,#head-pointer,head"
  *
  *  deleteNode:
  *           parameter1: Node ID
  *           Example: "deleteNode,#node3"
  *
  *  setNodeData:
  *           parameter1: Node ID
  *           parameter2: data to set
  *           Example: "setNodeData,#node3,5"
  *
  *  insertNodeAtIndex:
  *           parameter1: index to insert the node. Optionally pass "tail" to set as tail node. (We need this, because loops tail is ambiguous)
  *           parameter2 OPTIONAL: Node ID - if ommitted goes not last created node
  *           Example: "insertNodeAtIndex,#node3,1"
  *
  *  movePointer:
  *           parameter1: Pointer ID
  *           parameter2: Number of nodes to move it over, negative to move left
  *           Example: "movePointer,#head-pointer,-1"
  *
  *  setPointerNull:
  *           parameter1: Pointer ID
  *           Example: "setPointerNull,#node3-pointer"
  *
  *  elongatePointer:
  *           parameter1: Pointer ID
  *           Example: "elongatePointer,#node3-pointer"
  */
function VisualizationComponent(props, ref) {
  const { animations, preStartAnimations, updateLine, setPlayDisabled } = props;
  const ANIME_DURATION = 1000;

  // Line number in the code we are currently on, starting at 0.
  // Note Line numbers are not including the hidden code at the top.
  const selectedLineNumber = useRef(0);

  const tl = useRef(null); // Anime.js timeline object, instatiated in useEffect after rendered = true
  const isCurrentlyPaused = useRef(true); // Keeps track if we are in the middle of an animation or not
  const isPlayingFullAnimation = useRef(false); // True if clicked Play all instead of next line
  const [rendered, setRendered] = useState(false); // Flips to true when all the SVGs we need are created

  const allNodes = useRef([]); // Every node the animation will need, this gets filled on mount
  const nodesToBeInserted = useRef([]); // Nodes that are visible but above the list
  const insertedNodes = useRef([]); // Nodes in the list
  const allPointers = useRef([]); // Every pointer the animation will need, this gets filled on mount

  // Converts an animation string to funciton calls based on the rules listed
  // in component header comment
  const parseAndCallAnimation = (animationString, shouldRunImmediately) => {
    const parameters = animationString.replace(/\s/g, '').split(',');
    const functionName = parameters[0];
    if (functionName === 'createNewNode') {
      const nodeNumber = insertedNodes.current.length + nodesToBeInserted.current.length + 1;
      const data = parameters.length > 1 ? parameters[1] : nodeNumber;
      const nodeID = parameters.length > 2 ? parameters[2] : '#node' + nodeNumber;
      createNewNode(nodeID, data, shouldRunImmediately);
    } else if (functionName === 'createNewPointer') {
      createNewPointer(parameters[1], shouldRunImmediately);
    } else if (functionName === 'deleteNode') {
      deleteNode(parameters[1], shouldRunImmediately);
    } else if (functionName === 'setNodeData') {
      setNodeData(parameters[1], parameters[2], shouldRunImmediately);
    } else if(functionName === 'insertNodeAtIndex') {
      const index = parameters[1] === 'tail' ? insertedNodes.current.length : parameters[1];
      const node = parameters.length === 2 ? nodesToBeInserted.current[0] : parameters[2];
      insertNodeAtIndex(index, node, shouldRunImmediately);
    } else if (functionName === 'movePointer') {
      movePointer(parameters[1], parameters[2], shouldRunImmediately);
    } else if (functionName === 'setPointerNull') {
      setPointerNull(parameters[1], shouldRunImmediately);
    } else if (functionName === 'elongatePointer') {
      elongatePointer(parameters[1], shouldRunImmediately);
    }
  };

  // Reset everything when the submodule changes
  useEffect(() => {
    if (tl.current != null) {
      tl.current.pause();
      tl.current = null;
    }
    selectedLineNumber.current = 0;
    isCurrentlyPaused.current = true;
    isPlayingFullAnimation.current = false;
    allNodes.current = [];
    nodesToBeInserted.current = [];
    insertedNodes.current = [];
    allPointers.current = [];
    setRendered(false);
    setPlayDisabled(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animations, preStartAnimations]);

  // This callback gets called when rendered changes
  // If rendered is true -> Setup the timeline
  // If rendered is false -> Create the SVGs that the timeline will need, set renered true
  useEffect(() => {
    if (rendered) {
      preStartAnimations.forEach(animationString => {
        parseAndCallAnimation(animationString, true);
      });


      animations.forEach(animationStringArray => {
        // Add a callback so we know when the animation started
        tl.current.add({
          duration: 100, // Anime.js issue - begin doesn't always get called when this is 0
          begin: () => {
            isCurrentlyPaused.current = false;
            selectedLineNumber.current++;
            // Don't show the updated line if there are no animations on it
            if (animationStringArray != null && animationStringArray.length > 0) {
              updateLine(selectedLineNumber.current);
            }
            setPlayDisabled(true);
          }
        });

        // Add all of our animations to the timeline
        if (animationStringArray !== null) {
          animationStringArray.forEach(animationString => {
            parseAndCallAnimation(animationString, false);
          });
        }

        // Add a callback so we know when the animation ended
        tl.current.add({
          duration: 0,
          complete: () => {
            isCurrentlyPaused.current = true;
            if (!isPlayingFullAnimation.current && animationStringArray !== null && animationStringArray.length > 0) {
              pauseAnimation();
            }
          }
        });
      });
    } else {
      // Create the timeline and add all of the SVGs that we will need to the DOM
      tl.current = anime.timeline({
        // Delay is needed, because pause does not happen immediately. This should prevent that race condition.
        delay: 100,
        autoplay: false,
        easing: 'easeOutExpo',
        duration: ANIME_DURATION,
        complete: () => {
          selectedLineNumber.current = 0;
          isCurrentlyPaused.current = true;
          isPlayingFullAnimation.current = false;
          setPlayDisabled(false);
          updateLine(selectedLineNumber.current);

          // TODO This is a hack to "reset" the preStartAnimations
          allNodes.current = [];
          nodesToBeInserted.current = [];
          insertedNodes.current = [];
          allPointers.current = [];
          tl.current = null;
        }
      });
      // Determine all of the nodes and pointers we will create
      [[...preStartAnimations], ...animations].forEach(animationStringArray => {
        if (animationStringArray !== null) {
          animationStringArray.forEach(animationString => {
            const parameters = animationString.split(',');
            const functionName = parameters[0];
            if (functionName === 'createNewNode') {
              const nodeNumber = allNodes.current.length + 1;
              const data = parameters.length > 1 ? parameters[1] : nodeNumber;
              const nodeID = parameters.length > 2 ? parameters[2] : '#node' + nodeNumber;
              allNodes.current.push({
                id: nodeID,
                data
              });
            } else if (functionName === 'createNewPointer') {
              allPointers.current.push({
                id: parameters[1],
                name: parameters[2],
                location: 0,
                offset: 0,
                inserted: false
              });
            }
          });
        }
      });
      setRendered(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rendered]);

  /********* Functions Accessable By Parent *********/

  const nextLine = () => {
    if (allNodes.current.length === 0) {
      setRendered(false);
    } else {
      tl.current.play();
    }
  };

  const playFullAnimation = () => {
    if (allNodes.current.length !== 0) {
      isPlayingFullAnimation.current = true;
    }
    nextLine();
  };

  const pauseAnimation = () => {
    isPlayingFullAnimation.current = false;
    tl.current.pause();
    setPlayDisabled(false);
  };

  // TODO this doesn't work
  const previousLine = () => {
    // if (isCurrentlyPaused.current) {
    //   isCurrentlyPaused.current = false;
    //   selectedLineNumber.current--;
    //   updateLine(selectedLineNumber.current);
    //   tl.current.reverse();
    //   tl.current.play();
    // }
  };

  useImperativeHandle(ref, () => ({
    nextLine,
    playFullAnimation,
    pauseAnimation,
    previousLine
  }));

  /********* Public Animations *********/

  /**
   * Animation that changes the opacity of the given node to 100%, giving the impression of creating a
   * node.
   * @param {String or DOM Element} nodeID ID to give the new node
   * @param {String} data string to place in the data field for the new node
   * @param {boolean} shouldRunImmediately if the animation should run with 0 duration
   */
  const createNewNode = (nodeID, data, shouldRunImmediately=false) => {
    // If we create the first node, always just insert it
    if (insertedNodes.current.length === 0) {
      insertedNodes.current.push(nodeID);
      animate({
        duration: 0,
        targets: nodeID,
        translateY: '+=150px',
      }, shouldRunImmediately, '-=' + ANIME_DURATION); // TODO is this offset doing anything?
    } else {
      nodesToBeInserted.current.push(nodeID);
    }
    animate({
      targets: nodeID,
      opacity: '1'
    }, shouldRunImmediately);
  };

  const createNewPointer = (pointer, shouldRunImmediately=false) => {
    const newPointerObj = allPointers.current.find(pointerObj => pointerObj.id === pointer);
    const newPointerLocation = newPointerObj.location != null ? newPointerObj.location : 0;
    const otherPointerAtLocation = allPointers.current.find(pointerObj => {
      return pointerObj.location === newPointerLocation && pointerObj.inserted;
    });
    if (otherPointerAtLocation != null) {
      animate({
        targets: otherPointerAtLocation.id + '-container',
        x: '-=30px',
        duration: 500
      }, shouldRunImmediately);
      animate({
        duration: 0,
        targets: pointer + '-container',
        x: '+=30px',
      }, shouldRunImmediately);
      otherPointerAtLocation.offest = -30;
      newPointerObj.offset = 30;
    }

    animate({
      targets: pointer,
      opacity: '1'
    }, shouldRunImmediately, otherPointerAtLocation != null ? '-=500' : '-=0');
    newPointerObj.inserted = true;
  };

  /**
   * Animation that changes the opacity of the given node to 0%, giving the impression of deleting a
   * node.
   * @param {String or DOM Element} node A CSS Selector or DOM Element representing a linked list node
   * @param {boolean} shouldRunImmediately if the animation should run with 0 duration
   */
  const deleteNode = (node, shouldRunImmediately=false) => {
    animate({
      targets: node,
      opacity: '0'
    }, shouldRunImmediately);
  };

  const setNodeData = (node, data, shouldRunImmediately=false) => {
    const nodeDataId = node + '-data';
    const dataFieldContainer = document.querySelector(node + " > .node-data-field");
    const currData = document.getElementById(nodeDataId.substr(1));

    // Create new data text element to replace old data text element
    const newData = document.createElementNS("http://www.w3.org/2000/svg", "text");
    newData.classList.add("text");
    newData.setAttribute("x", "101px");
    newData.setAttribute("y", "70px");
    newData.setAttribute("fill", "#000");
    newData.setAttribute("opacity", "0");
    newData.textContent = data;
    dataFieldContainer.appendChild(newData);

    // Fade out old data
    animate({
      targets: currData,
      translateY: '-=15px',
      opacity: '0',
    }, shouldRunImmediately);

    // Fade in new data
    animate({
      targets: newData,
      translateY: '-=15px',
      opacity: '1'
    }, shouldRunImmediately, '-=' + ANIME_DURATION); // Offset ensures that both animations happen at the same time
  };

  /*
   * Insert a node that was already rendered and set as visible in nodesToBeInserted.
   * Note this cannot be used to move a node that is already inserted.
   */
  const insertNodeAtIndex = (index, node, shouldRunImmediately=false) => {
    // insert at head
    if (index < 1) {
      // Make room in Linked List for new node
      animate({
        targets: ['#head-pointer'].concat(insertedNodes.current),
        translateX: '+=200px'
      }, shouldRunImmediately);

      // Move new node inline with list
      moveNodeInline(node, shouldRunImmediately);

      // Set nodes next to point to the old head
      setPointerToNext(node + '-pointer', shouldRunImmediately);
      insertedNodes.current.push(node);
      insertedNodes.current = [node, ...insertedNodes.current]
    } else if (index >= insertedNodes.current.length) { // insert at tail
      // move the node over
      const distance = insertedNodes.current.length * 200;
      animate({
        targets: node,
        translateX: '+=' + distance + 'px'
      }, shouldRunImmediately);

      // Move new node inline with list
      moveNodeInline(node, shouldRunImmediately);

      // Set old tail node pointer to new node
      setPointerToNext(insertedNodes.current[insertedNodes.current.length - 1] + '-pointer', shouldRunImmediately);
      insertedNodes.current.push(node);
    } else { // TODO insert in middle
      //TODO
      insertedNodes.current = [...insertedNodes.current.slice(0, index), node, ...insertedNodes.current.slice(index)]
    }

    nodesToBeInserted.current = nodesToBeInserted.current.filter(oldNode => oldNode !== node);
  };

  /**
   * Moves a pointer some number of nodes over from its current position
   * @param numNodes {Number} Number of nodes to move the pointer. Negative to move left
   */
  const movePointer = (pointer, numNodes, shouldRunImmediately=false) => {

    const movePointerObj = allPointers.current.find(pointerObj => pointerObj.id === pointer);
    const oldLocation = movePointerObj.location != null ? movePointerObj.location : 0;

    const pointerAtPrevSpot = allPointers.current.find(pointerObj => {
      return pointerObj.location === oldLocation && pointerObj.inserted && pointerObj.id !== pointer;
    });
    const pointerAtNextSpot = allPointers.current.find(pointerObj => {
      return pointerObj.location === (oldLocation + numNodes) && pointerObj.inserted && pointerObj.id !== pointer;
    });
    let timelineOffset = 0; // Allows us to show multiple animations at once

    // Move the pointer at the next spot over
    if (pointerAtNextSpot != null) {
      animate({
        duration: 500,
        targets: pointerAtNextSpot.id + '-container',
        x: numNodes > 0 ? '+=30px' : '-=30px'
      }, shouldRunImmediately);
      timelineOffset += 500;
      pointerAtNextSpot.offset = numNodes > 0 ? 30 : -30;
    }

    // Calculate the distance that the pointer needs to travel and which direction to travel in
    const distanceBetweenNodes = Math.abs(200 * numNodes);
    const distanceToCurrentMiddle = movePointerObj.offset * (numNodes > 0 ? -1 : 1);
    const distanceFromNextOffset = pointerAtNextSpot == null ? 0 : -30;
    const finalDistance = distanceBetweenNodes + distanceToCurrentMiddle + distanceFromNextOffset;
    const direction = numNodes < 0 ? '-=' : '+=';

    // Move the pointer to the desired distance in the correct direction
    animate({
      duration: 500,
      targets: pointer + '-container',
      x: direction + finalDistance + 'px',
    }, shouldRunImmediately, '-=' + timelineOffset);
    timelineOffset += 500;

    // Move the pointer on the previous node back to the center of its node
    if (pointerAtPrevSpot != null) {
      animate({
        duration: 500,
        targets: pointerAtPrevSpot.id + '-container',
        x: pointerAtPrevSpot.offset > 0 ? '-=30px' : '+=30px'
      }, shouldRunImmediately, '-=' + timelineOffset);
      pointerAtPrevSpot.offset = 0;
    }

    movePointerObj.location += numNodes;
    movePointerObj.offset = pointerAtNextSpot != null ? numNodes > 0 ? -30 : 30 : 0;
  };

  const setPointerNull = (pointer, shouldRunImmediately=false) => {
    animate({
      targets: pointer + '-tip',
      translateY: '+=75px',
      height: '-=75px'
    }, shouldRunImmediately);
  };

  const elongatePointer = (pointer, shouldRunImmediately=false) => {
    animate({
      targets: pointer + '-tip',
      translateY: '-=75px',
      height: '+=75px'
    }, shouldRunImmediately);
  };

  /********* Internal Only Animations *********/
  const setPointerToNext = (pointer, shouldRunImmediately=false) => {
    animate({
      targets: pointer,
      width: '+=90px'
    }, shouldRunImmediately);
  }

  const moveNodeInline = (node, shouldRunImmediately=false) => {
    animate({
      targets: node,
      translateY: '+=150px'
    }, shouldRunImmediately)
  };

  // Helper function to replace calls to tl.current.add and anime()
  const animate = (options, shouldRunImmediately=false, timelineOffset=undefined) => {
    if (shouldRunImmediately) {
      options.duration = 0;
      anime(options);
    } else {

      tl.current.add(options, timelineOffset);
    }
  };

  if (!rendered) {
    return null;
  }

  const svgWdith = allNodes.current.length > 3 ? allNodes.current.length * 200 + 50 : '100%';
  return (
    <div>
      <svg width={svgWdith} height="calc(100vh - 6.5em)">
        {
          allNodes.current.map((node, i) => {
            const id = node.id.substring(1); // Remove the #
            return <LinkedListNode key={id + i} nodeID={id} data={node.data} />
          })
        }

        {
          allPointers.current.map((pointer, i) => {
            const id = pointer.id.substring(1); // Remove the #
            return <LinkedListPointer key={id + i} pointerID={id} name={pointer.name} />
          })
        }
      </svg>
    </div>
  );
}

/**
 * Controls if the component should rerender. We only want this to occur
 * when a new animation is being loaded in. Otherwise rerendering will break
 * animations in progress.
 *
 * If returns true, don't rerender. Else rerender as usual
 */
function shouldPreventRerender (prevProps, nextProps) {
  return nextProps.animations === null || prevProps.animations === nextProps.animations;
};

// ForwardRef to Allow the parent to access functions made public above
// Memo so we can prevent the component from rerendering with  shouldPreventRerender
const Visualization = memo(forwardRef(VisualizationComponent), shouldPreventRerender);

export default Visualization;
