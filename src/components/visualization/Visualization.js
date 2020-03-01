import React, { useEffect, memo, forwardRef, useImperativeHandle, useRef, useState } from "react";
import anime from 'animejs';
import LinkedListNode from './LinkedListNode';
import LinkedListPointer from './LinkedListPointer';

/*
TODOS:
- Height is set ot 80vh -  this is a random number I came up with...
- createNewPointer should be able to create curr/temp pointers on other nodes. Right now head-pointer is only one that exists
- Reverse doesn't work
- Pause works, but we should make it finish the current line
- line numbers can get off if play/pause and next line a lot
- Data in linkedListNode is not centered if only 1 character
- pointer names are not always centered
- How to handle two pointers on the same node at once (see insert at tail). Worst case we can just ignore these
- Firefox and Safari are completely broken spacing - Maybe issue with how we use vh?
*/

/**
  * Required Props:
  * animations {String[]} – Array of Animation strings as defined below
  * updateLine {Function} - Callback run to update the line number of parent
  *
  * Animation strings are comma seperated values. The first value is the name of the function to be called.
  * Other values correspond to arguments to the functions, always as strings.
  * Below is a list of all possible animation string function names and their parameters.
  *
  *  createNewNode:
  *           parameter1 OPTIONAL: Node ID - defaults to next available
  *           parameter2 OPTIONAL: data - defaults its node number
  *           Example: "createNewNode,#node3,4"
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
  const { animations, updateLine } = props;

  const ANIME_DURATION = 1000;
  const tl = useRef(null);
  const line = useRef(1);
  const prevAnimationFinished = useRef(true);
  const isPlayingFullAnimation = useRef(false);
  const [rendered, setRendered] = useState(false);

  let allNodes = useRef([]); // Every node the animation will need, this gets filled on mount
  let nodesToBeInserted = useRef([]); // Nodes that are visible but above the list
  const insertedNodes = useRef([]); // Nodes in the list
  let allPointers = useRef([]); // Every pointer the animation will need, this gets filled on mount

  // Converts an animation string to funciton calls based on the rules listed
  // in component header comment
  const parseAndCallAnimation = animationString => {
    const parameters = animationString.replace(/\s/g, '').split(',');
    const functionName = parameters[0];
    if (functionName === 'createNewNode') {
      const nodeNumber = insertedNodes.current.length + nodesToBeInserted.current.length + 1;
      const nodeID = parameters.length > 1 ? parameters[1] : '#node' + nodeNumber;
      const data = parameters.length > 2 ? parameters[2] : nodeNumber;
      createNewNode(nodeID, data);
    } else if (functionName === 'createNewPointer') {
      createNewPointer(parameters[1]);
    } else if (functionName === 'deleteNode') {
      deleteNode(parameters[1]);
    } else if (functionName === 'setNodeData') {
      setNodeData(parameters[1], parameters[2]);
    } else if(functionName === 'insertNodeAtIndex') {
      const index = parameters[1] === 'tail' ? insertedNodes.current.length : parameters[1];
      const node = parameters.length === 2 ? nodesToBeInserted.current[0] : parameters[2];
      insertNodeAtIndex(index, node);
    } else if (functionName === 'movePointer') {
      movePointer(parameters[1], parameters[2]);
    } else if (functionName === 'setPointerNull') {
      setPointerNull(parameters[1]);
    } else if (functionName === 'elongatePointer') {
      elongatePointer(parameters[1]);
    }
  };

  // Reset everything when the submodule changes
  useEffect(() => {
    tl.current = null;
    line.current = 1;
    prevAnimationFinished.current = true;
    isPlayingFullAnimation.current = false;
    allNodes.current = [];
    nodesToBeInserted.current = [];
    insertedNodes.current = [];
    allPointers.current = [];
    setRendered(false);
  }, [animations]);

  useEffect(() => {
    if (rendered) {
      animations.forEach(animationStringArray => {
        // Add a callback so we know when the animation started
        tl.current.add({
          begin: () => {
            prevAnimationFinished.current = false;
            line.current++;
            updateLine(line.current);
          }
        });

        // Add all of our animations to the timeline
        if (animationStringArray !== null) {
          animationStringArray.forEach(animationString => {
            parseAndCallAnimation(animationString);
          });
        }

        // Add a callback so we know when the animation ended
        tl.current.add({
          duration: 0,
          complete: () => {
            prevAnimationFinished.current = true;
            if (!isPlayingFullAnimation.current) {
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
          line.current = 1;
          prevAnimationFinished.current = true;
          isPlayingFullAnimation.current = false;
        }
      });
      animations.forEach(animationStringArray => {
        if (animationStringArray !== null) {
          animationStringArray.forEach(animationString => {
            const parameters = animationString.split(',');
            const functionName = parameters[0];
            if (functionName === 'createNewNode') {
              const nodeNumber = allNodes.current.length + 1;
              const nodeID = parameters.length > 1 ? parameters[1] : '#node' + nodeNumber;
              const data = parameters.length > 2 ? parameters[2] : nodeNumber;
              allNodes.current.push({
                id: nodeID,
                data
              });
            } else if (functionName === 'createNewPointer') {
              allPointers.current.push({
                id: parameters[1],
                name: parameters[2]
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
    tl.current.play();
  };

  const playFullAnimation = () => {
    isPlayingFullAnimation.current = true;
    nextLine();
  };

  const pauseAnimation = () => {
    isPlayingFullAnimation.current = false;
    tl.current.pause();
  };

  // TODO this doesn't work
  const previousLine = () => {
    if (prevAnimationFinished.current) {
      prevAnimationFinished.current = false;
      line.current--;
      updateLine(line.current);
      tl.current.reverse();
      tl.current.play();
    }
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
   */
  const createNewNode = (nodeID, data) => {
    // If we create the first node, always just insert it
    if (insertedNodes.current.length === 0) {
      insertedNodes.current.push(nodeID);
      tl.current.add({
        targets: nodeID,
        translateY: '+=150px',
      }, '-=' + ANIME_DURATION);
    } else {
      nodesToBeInserted.current.push(nodeID);
    }
    tl.current.add({
      targets: nodeID,
      opacity: '1'
    });
  };

  const createNewPointer = pointer => {
    tl.current.add({
      targets: pointer,
      opacity: '1'
    });
  };

  /**
   * Animation that changes the opacity of the given node to 0%, giving the impression of deleting a
   * node.
   * @param {String or DOM Element} node A CSS Selector or DOM Element representing a linked list node
   */
  const deleteNode = node => {
    tl.current.add({
      targets: node,
      opacity: '0'
    });
  };

  const setNodeData = (node, data) => {
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
    tl.current.add({
      targets: currData,
      translateY: '-=15px',
      opacity: '0'
    });

    // Fade in new data
    tl.current.add({
      targets: newData,
      translateY: '-=15px',
      opacity: '1'
    }, '-=' + ANIME_DURATION); // Offset ensures that both animations happen at the same time
  };

  /*
   * Insert a node that was already rendered and set as visible in nodesToBeInserted.
   * Note this cannot be used to move a node that is already inserted.
   */
  const insertNodeAtIndex = (index, node) => {
    // TODO: insertMiddle

    // insert at head
    if (index < 1) {
      // Make room in Linked List for new node
      tl.current.add({
        targets: ['#head-pointer'].concat(insertedNodes.current),
        translateX: '+=200px'
      });

      // Move new node inline with list
      moveNodeInline(node);

      // Set nodes next to point to the old head
      setPointerToNext(node + '-pointer');
    } else if (index >= insertedNodes.current.length) { // insert at tail
      // move the node over
      const distance = insertedNodes.current.length * 200;
      tl.current.add({
        targets: node,
        translateX: '+=' + distance + 'px'
      });

      // Move new node inline with list
      moveNodeInline(node);

      // Set old tail node pointer to new node
      setPointerToNext(insertedNodes.current[insertedNodes.current.length - 1] + '-pointer');
    } else { // insert in middle
      //TODO
    }

    nodesToBeInserted.current = nodesToBeInserted.current.filter(oldNode => oldNode !== node);
    insertedNodes.current.push(node);
  };

  /**
   * Moves a pointer some number of nodes over from its current position
   * @param numNodes {Number} Number of nodes to move the pointer. Negative to move left
   */
  const movePointer = (pointer, numNodes) => {
    const distance = Math.abs(200 * numNodes);
    const direction = numNodes < 0 ? '-=' : '+=';
    tl.current.add({
      targets: pointer,
      translateX: direction + distance + 'px',
    });
  };

  const setPointerNull = pointer => {
    tl.current.add({
      targets: pointer + '-tip',
      translateY: '+=75px',
      height: '-=75px'
    });
  };

  const elongatePointer = pointer => {
    tl.current.add({
      targets: pointer + '-tip',
      translateY: '-=75px',
      height: '+=75px'
    });
  };

  /********* Internal Only Animations *********/
  const setPointerToNext = pointer => {
    tl.current.add({
      targets: pointer,
      width: '+=100px'
    });
  }

  const moveNodeInline = node => {
    tl.current.add({
      targets: node,
      translateY: '+=150px'
    });
  };

  if (!rendered) {
    return null;
  }

  return (
    <div>
      <svg width="100%" height="80vh">
        {
          allNodes.current.map(node => {
            const id = node.id.substring(1); // Remove the #
            return <LinkedListNode key={id} nodeID={id} data={node.data} />
          })
        }

        {
          allPointers.current.map(pointer => {
            const id = pointer.id.substring(1); // Remove the #
            return <LinkedListPointer key={id} pointerID={id} name={pointer.name} />
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

const Visualization = memo(forwardRef(VisualizationComponent), shouldPreventRerender);

export default Visualization;
