import React, { useEffect, memo, forwardRef, useImperativeHandle, useRef, useState } from "react";
import useAnimation  from '../../hooks/useAnimation';
import LinkedListNode from './LinkedListNode';
import LinkedListPointer from './LinkedListPointer';
import VariableTableRow from './VariableTableRow';

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
  * setAnimationComplete {Function} - Callback run when the animation finishes
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
  *
  *  createVarTable:
  *           Example: "createVarTable"
  *           Parameters: name,value,name,value,etc for rows to start as inserted
  *
  *  addVarTableRow:
  *           parameter1: variable name
  *           parameter2: starting value
  *           Example: "addVarTableRow,i,0"
  *
  * removeVarTableRow:
  *           parameter1: variable name
  *           Example: "removeVarTableRow,i"
  *
  * setRowData:
  *           parameter1: variable name
  *           parameter2: data
  *           Example: "setRowData,i,25"
  */
function VisualizationComponent(props, ref) {
  const { animations, preStartAnimations, updateLine, setPlayDisabled, setAnimationComplete } = props;
  const ANIME_DURATION = 1000;

  // Line number in the code we are currently on, starting at 0.
  // Note Line numbers are not including the hidden code at the top.
  const selectedLineNumber = useRef(0);

  const hasVariableTable = useRef(false); // True if createVarTable is in animations
  const [rendered, setRendered] = useState(false); // Flips to true when all the SVGs we need are created

  const allNodes = useRef([]); // Every node the animation will need, this gets filled on mount
  const nodesToBeInserted = useRef([]); // Nodes that are visible but above the list
  const insertedNodes = useRef([]); // Nodes in the list
  const allPointers = useRef([]); // Every pointer the animation will need, this gets filled on mount
  const allVariableRows = useRef([]); // All of the rows to insert, have name, value and selectedValueIndex
  const insertedRows = useRef([]); // Row IDs inserted in variable table
  const currentAnimations = useRef([]); // Animations for current line not added to timeline yet

  const onAnimationComplete = () => {
    selectedLineNumber.current = 0;
    setPlayDisabled(false);
    updateLine(selectedLineNumber.current);
    setAnimationComplete(true);

    // TODO This is a hack to "reset" the preStartAnimations
    allNodes.current = [];
    nodesToBeInserted.current = [];
    insertedNodes.current = [];
    allPointers.current = [];
    allVariableRows.current = [];
    insertedRows.current = [];
    hasVariableTable.current = false;
  };

  const { addAnimation, stepAnimation, playFullAnimation, clearAnimations, isPlayingFullAnimation, pauseAnimation } = useAnimation(onAnimationComplete);

  const onStepBegin = () => {
    selectedLineNumber.current++;
    updateLine(selectedLineNumber.current);
  };

  const onStepEnd = () => {
    if (!isPlayingFullAnimation.current) {
      setPlayDisabled(false);
    }
  };

  const animate = (options, shouldRunImmediately = false) => {
    if (shouldRunImmediately) {
      addAnimation(options, shouldRunImmediately);
    } else {
      let minDelay = 0;
      currentAnimations.current.forEach(animation => {
        const duration = animation.duration != null ? animation.duration : ANIME_DURATION;
        const delay = animation.delay != null ? animation.delay : 0;
        const time = duration + delay;
        if (time > minDelay) {
          minDelay = time;
        }
      });
      const delayedOptions = options.map(option => {
        return {
          ...option,
          delay: option.delay != null ? option.delay + minDelay : minDelay
        }
      });
      currentAnimations.current = [...currentAnimations.current, ...delayedOptions];
    }
  };

  const addCurrentToTimeline = () => {
    addAnimation(currentAnimations.current, false, onStepBegin, onStepEnd);
    currentAnimations.current = [];
  };

  // Helper function to remove nulls, only from end of array
  const removeTrailingNull = (arr) => {
    const newArray = [...arr];
    for (let i = newArray.length - 1; i >= 0; i--) {
      if (newArray[i] == null) {
        newArray.pop();
      } else {
        break;
      }
    }
    return newArray;
  };

  const [animationsArray, setAnimationsArray] = useState(removeTrailingNull(animations));

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
    } else if (functionName === 'insertNodeAtIndex') {
      const index = parameters[1] === 'tail' ? insertedNodes.current.length : parameters[1];
      const node = parameters.length === 2 ? nodesToBeInserted.current[0] : parameters[2];
      insertNodeAtIndex(index, node, shouldRunImmediately);
    } else if (functionName === 'movePointer') {
      movePointer(parameters[1], parameters[2], shouldRunImmediately);
    } else if (functionName === 'setPointerNull') {
      setPointerNull(parameters[1], shouldRunImmediately);
    } else if (functionName === 'elongatePointer') {
      elongatePointer(parameters[1], shouldRunImmediately);
    } else if (functionName === 'createVarTable') {
      let rows = [];
      for (let i = 1; i < parameters.length; i+=2) {
        rows.push(parameters[i]);
      }
      createVarTable(rows, shouldRunImmediately);
    } else if (functionName === 'addVarTableRow') {
      addVarTableRow(parameters[1], parameters[2], shouldRunImmediately);
    } else if (functionName === 'removeVarTableRow') {
      removeVarTableRow(parameters[1], shouldRunImmediately);
    } else if (functionName === 'setRowData') {
      setRowData(parameters[1], parameters[2], shouldRunImmediately);
    }
  };

  // Reset everything when the submodule changes
  useEffect(() => {
    selectedLineNumber.current = 0;
    allNodes.current = [];
    nodesToBeInserted.current = [];
    insertedNodes.current = [];
    allPointers.current = [];
    allVariableRows.current = [];
    insertedRows.current = [];
    hasVariableTable.current = false;
    setRendered(false);
    setPlayDisabled(false);
    setAnimationsArray(removeTrailingNull(animations));
    clearAnimations();
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
      animationsArray.forEach(animationStringArray => {
        // Add all of our animations to the timeline
        if (animationStringArray !== null) {
          animationStringArray.forEach(animationString => {
            parseAndCallAnimation(animationString, false);
          });
          addCurrentToTimeline();
        } else {
          addAnimation([], false, () => {}, () => {
            selectedLineNumber.current++;
            if (!isPlayingFullAnimation.current) {
              stepAnimation();
            }
          });
        }
      });
    } else {
      // Determine all of the nodes and pointers we will create
      [[...preStartAnimations], ...animationsArray].forEach(animationStringArray => {
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
                data,
                selectedDataIndex: 0
              });
            } else if (functionName === 'createNewPointer') {
              allPointers.current.push({
                id: parameters[1],
                name: parameters[2],
                location: 0,
                offset: 0,
                inserted: false
              });
            } else if (functionName === 'addVarTableRow') {
              allVariableRows.current.push({
                name: parameters[1],
                value: parameters[2],
                selectedValueIndex: 0
              });
            } else if (functionName === 'createVarTable') {
              hasVariableTable.current = true;
              for (let i = 1; i < parameters.length; i+=2) {
                allVariableRows.current.push({
                  name: parameters[i],
                  value: parameters[i + 1],
                  selectedValueIndex: 0
                });
              }
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
      setPlayDisabled(true);
      stepAnimation();
    }
  };

  const onPressPlay = () => {
    playFullAnimation();
    setPlayDisabled(true);
  };

  const onPressPause = () => {
    pauseAnimation();
  //   isPlayingFullAnimationOld.current = false;
  //   // tl.current.pause();
    setPlayDisabled(false);
  };

  // TODO this doesn't work
  const previousLine = () => {
  //   // if (isCurrentlyPaused.current) {
  //   //   isCurrentlyPaused.current = false;
  //   //   selectedLineNumber.current--;
  //   //   updateLine(selectedLineNumber.current);
  //   //   tl.current.reverse();
  //   //   tl.current.play();
  //   // }
  };

  useImperativeHandle(ref, () => ({
    nextLine,
    playFullAnimation: onPressPlay,
    pauseAnimation: onPressPause,
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
  const createNewNode = (nodeID, data, shouldRunImmediately = false) => {
    const animations = [];

    // If we create the first node, always just insert it
    if (insertedNodes.current.length === 0) {
      insertedNodes.current.push(nodeID);
      animate([{
        duration: 0,
        targets: nodeID,
        translateY: '+=150px',
      }], true);
    } else {
      nodesToBeInserted.current.push(nodeID);
    }
    animations.push({
      targets: nodeID,
      opacity: '1'
    });
    animate(animations, shouldRunImmediately);
  };

  const createNewPointer = (pointer, shouldRunImmediately = false) => {
    const newPointerObj = allPointers.current.find(pointerObj => pointerObj.id === pointer);
    const newPointerLocation = newPointerObj.location != null ? newPointerObj.location : 0;
    const otherPointerAtLocation = allPointers.current.find(pointerObj => {
      return pointerObj.location === newPointerLocation && pointerObj.inserted;
    });
    const animations = [];
    if (otherPointerAtLocation != null) {
      animations.push({
        targets: otherPointerAtLocation.id,
        translateX: '-=30px',
        duration: 500
      });
      animations.push({
        duration: 0,
        targets: pointer,
        translateX: '+=30px',
      });
      otherPointerAtLocation.offest = -30;
      newPointerObj.offset = 30;
    }

    animations.push({
      targets: pointer,
      opacity: '1',
      delay: otherPointerAtLocation != null ? 500 : 0
    });
    newPointerObj.inserted = true;
    animate(animations, shouldRunImmediately);
  };

  /**
   * Animation that changes the opacity of the given node to 0%, giving the impression of deleting a
   * node.
   * @param {String or DOM Element} node A CSS Selector or DOM Element representing a linked list node
   * @param {boolean} shouldRunImmediately if the animation should run with 0 duration
   */
  const deleteNode = (node, shouldRunImmediately = false) => {
    animate([{
      targets: node,
      opacity: '0'
    }], shouldRunImmediately);
  };

  const setNodeData = (node, data, shouldRunImmediately=false) => {
    const nodeObj = allNodes.current.find(currNode => currNode.id === node);
    const currDataIndex = nodeObj.selectedDataIndex;
    const dataFieldContainer = document.querySelector(node + " > .node-data-field");
    const currData = document.querySelectorAll(node + " > .node-data-field .node-data-text")[currDataIndex];

    // Create new data text element to replace old data text element
    const newData = document.createElementNS("http://www.w3.org/2000/svg", "text");
    newData.classList.add("text");
    newData.setAttribute("x", "110px");
    newData.setAttribute("y", "66px");
    newData.setAttribute("dominant-baseline", "middle");
    newData.setAttribute("text-anchor", "middle");
    newData.setAttribute("fill", "#000");
    newData.setAttribute("opacity", "0");
    newData.textContent = data;
    dataFieldContainer.appendChild(newData);

    // Fade out old data
    animate([
      {
        targets: currData,
        translateY: '-=15px',
        opacity: '0'
      },
      {
        targets: newData,
        translateY: '-=15px',
        opacity: '1',
      }
    ], shouldRunImmediately);

    nodeObj.selectedDataIndex++;
  };

  /*
   * Insert a node that was already rendered and set as visible in nodesToBeInserted.
   * Note this cannot be used to move a node that is already inserted.
   */
  const insertNodeAtIndex = (index, node, shouldRunImmediately = false) => {
    const animations = [];

    // insert at head
    if (index < 1) {
      // Make room in Linked List for new node
      animations.push({
        targets: ['#head-pointer'].concat(insertedNodes.current),
        translateX: '+=200px'
      });

      // Move new node inline with list
      animations.push({...getMoveNodeInlineOptions(node), delay: ANIME_DURATION});

      // Set nodes next to point to the old head
      animations.push({...getSetPointerToNextOptions(node + '-pointer'), delay: ANIME_DURATION * 2});
      insertedNodes.current.push(node);
      insertedNodes.current = [node, ...insertedNodes.current]
    } else if (index >= insertedNodes.current.length) { // insert at tail
      // move the node over
      const distance = insertedNodes.current.length * 200;
      animations.push({
        targets: node,
        translateX: '+=' + distance + 'px'
      });

      // Move new node inline with list
      animations.push({...getMoveNodeInlineOptions(node), delay: ANIME_DURATION});

      // Set old tail node pointer to new node
      animations.push({
        ...getSetPointerToNextOptions(insertedNodes.current[insertedNodes.current.length - 1] + '-pointer'),
        delay: ANIME_DURATION * 2
      });
      insertedNodes.current.push(node);
    } else { // TODO insert in middle
      //TODO
      insertedNodes.current = [...insertedNodes.current.slice(0, index), node, ...insertedNodes.current.slice(index)]
    }

    nodesToBeInserted.current = nodesToBeInserted.current.filter(oldNode => oldNode !== node);
    animate(animations, shouldRunImmediately);
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
    const animations = [];

    // Move the pointer at the next spot over
    if (pointerAtNextSpot != null) {
      animations.push({
        duration: 500,
        targets: pointerAtNextSpot.id,
        translateX: numNodes > 0 ? '+=30px' : '-=30px'
      });
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
    animations.push({
      duration: 500,
      targets: pointer,
      translateX: direction + finalDistance + 'px',
      delay: timelineOffset
    });
    timelineOffset += 500;

    // Move the pointer on the previous node back to the center of its node
    if (pointerAtPrevSpot != null) {
      animations.push({
        duration: 500,
        targets: pointerAtPrevSpot.id,
        translateX: pointerAtPrevSpot.offset > 0 ? '-=30px' : '+=30px',
        delay: timelineOffset
      });
      pointerAtPrevSpot.offset = 0;
    }

    movePointerObj.location += numNodes;
    movePointerObj.offset = pointerAtNextSpot != null ? numNodes > 0 ? -30 : 30 : 0;
    animate(animations, shouldRunImmediately);
  };

  const setPointerNull = (pointer, shouldRunImmediately = false) => {
    animate([{
      targets: pointer + '-tip',
      translateY: '+=75px',
      height: '-=75px'
    }], shouldRunImmediately);
  };

  const elongatePointer = (pointer, shouldRunImmediately = false) => {
    animate([{
      targets: pointer + '-tip',
      translateY: '-=75px',
      height: '+=75px'
    }], shouldRunImmediately);
  };

 /**
  * create a new var table
  * @param rows {Array[id]} Array of row ids to create
  */
  const createVarTable = (rows=[], shouldRunImmediately=false) => {
    const animations = [];
    animations.push({
      targets: '#var-table',
      opacity: '1'
    });

    if (rows != null) {
      for (let row of rows) {
        const rowID = '#var-table-row-' + row;
        insertedRows.current.push(rowID);
        const rowNum = insertedRows.current.indexOf(rowID) + 1;
        animations.push({
          targets: rowID,
          translateY: rowNum * 26 + "px",
          delay: ANIME_DURATION
        });
      }
    }
    animate(animations, shouldRunImmediately);
  };

  // Add row to table
  const addVarTableRow = (name, value, shouldRunImmediately=false) => {
    const id = '#var-table-row-' + name;
    insertedRows.current.push(id);
    const rowNum = insertedRows.current.indexOf(id) + 1;
    animate([{
      targets: id,
      translateY: rowNum * 26 + "px"
    }], shouldRunImmediately)
  };

  // Remove given row from table
  const removeVarTableRow = (variableName, shouldRunImmediately=false) => {
    const row = '#var-table-row-' + variableName;
    const rowNum = insertedRows.indexOf(row) + 1;
    const isLastRow = rowNum === insertedRows.current.length - 2;
    const animations = [];

    animations.push({
      targets: row,
      translateY: "-=" + rowNum * 26 + "px"
    });

    if (rowNum > 0) {
      insertedRows.current.splice(rowNum - 1, 1);
    }

    if (insertedRows.current.length > 0) {
      if (!isLastRow) {
        for (let insertedRow of insertedRows) {
          animations.push({
            targets: insertedRow,
            translateY: "-=26px",
            delay: ANIME_DURATION
          });
        }
      }
    } else {
      animations.push({
        targets: '#var-table',
        opacity: '0',
        delay: ANIME_DURATION
      });
    }
    animate(animations, shouldRunImmediately);
  };

  // Update row data
  const setRowData = (variableName, data, shouldRunImmediately=false) => {
    const row = '#var-table-row-' + variableName;
    const variableRow = allVariableRows.current.find(row => row.name === variableName);
    const currDataIndex = variableRow.selectedValueIndex;
    const currData = document.querySelectorAll(row + " > .data-value")[currDataIndex];
    const rowContainer = document.querySelector(row);

    // Create new data text element to replace old data text element
    const newData = document.createElementNS("http://www.w3.org/2000/svg", "text");
    newData.classList.add("data-value");
    newData.setAttribute("x", "149px");
    newData.setAttribute("y", "32px");
    newData.setAttribute("dominant-baseline", "middle");
    newData.setAttribute("text-anchor", "middle");
    newData.setAttribute("fill", "#000");
    newData.setAttribute("opacity", "0");
    newData.textContent = data;
    rowContainer.appendChild(newData);

    // Fade out old data
    animate([
      {
        targets: currData,
        translateY: '-=15px',
        opacity: '0'
      },
      {
        targets: newData,
        translateY: '-=15px',
        opacity: '1',
      }
    ], shouldRunImmediately);

    variableRow.selectedValueIndex++;
  };

  /********* Internal Only Animations *********/
  const getSetPointerToNextOptions = (pointer) => {
    return {
      targets: pointer,
      width: '+=90px'
    };
  };

  const getMoveNodeInlineOptions = (node) => {
    return {
      targets: node,
      translateY: '+=150px'
    };
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
            return <LinkedListNode key={id + i} nodeID={id} data={node.data} hasVariableTable={hasVariableTable.current} />
          })
        }

        {
          allPointers.current.map((pointer, i) => {
            const id = pointer.id.substring(1); // Remove the #
            return <LinkedListPointer key={id + i} pointerID={id} name={pointer.name} hasVariableTable={hasVariableTable.current} />
          })
        }

        <svg x="50px" y="10px">
          <g id="var-table" className="hidden">
            {
              allVariableRows.current.map((variable, i) => {
                const id = 'var-table-row-' + variable.name;
                return <VariableTableRow
                          key={id + i}
                          rowID={id}
                          variable={variable.name}
                          value={variable.value} />
              })
            }
            {/* Table Title */}
            <g className="var-table-row" id="var-table-title-row">
              <rect className="row-bg"></rect>
              <rect className="row-cell" x="4px" y="4px" rx="2px"></rect>
              <rect className="row-cell" x="102px" y="4px" rx="2px"></rect>
              <text x="49px" y="17px" fill="#fff" dominantBaseline="middle" textAnchor="middle">Variable</text>
              <text x="149px" y="17px" fill="#fff" dominantBaseline="middle" textAnchor="middle">Value</text>
            </g>
          </g>
        </svg>
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
function shouldPreventRerender(prevProps, nextProps) {
  return nextProps.animations === null || prevProps.animations === nextProps.animations;
};

// ForwardRef to Allow the parent to access functions made public above
// Memo so we can prevent the component from rerendering with  shouldPreventRerender
const Visualization = memo(forwardRef(VisualizationComponent), shouldPreventRerender);

export default Visualization;
