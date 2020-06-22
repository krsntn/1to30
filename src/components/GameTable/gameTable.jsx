import React, { useState, useEffect } from 'react';
import css from './gameTable.module.scss';

const ROW_SIZE = 3;
const COLUMN_SIZE = 3;
const NUMBER_PER_PAGE = ROW_SIZE * COLUMN_SIZE;

const generateArray = (startNum, totalSize) => {
  const array = [];
  for (var i = 0, num = startNum; i < totalSize; i++, num++) {
    array[i] = num;
  }
  array.sort(() => Math.random() - 0.5);

  return array;
};

const GameTable = (props) => {
  const { updateCurrentNumber, currentNumber, freeze, TOTAL_NUMBER } = props;
  const [displayArray, setDisplayArray] = useState([]);
  const [numArray, setNumArray] = useState({});

  useEffect(() => {
    const arrayObject = {};
    for (
      let number = 1, index = 0;
      TOTAL_NUMBER >= number;
      number += NUMBER_PER_PAGE, index++
    ) {
      arrayObject[index] = generateArray(
        number,
        TOTAL_NUMBER >= number && TOTAL_NUMBER < (index + 1) * NUMBER_PER_PAGE
          ? TOTAL_NUMBER - number + 1
          : NUMBER_PER_PAGE
      );
    }
    setNumArray(arrayObject);
    setDisplayArray(arrayObject[0]);
  }, [TOTAL_NUMBER]);

  const createRow = () => {
    const rows = [];
    for (let i = 0; i < ROW_SIZE; i++) {
      rows.push(<tr key={i}>{renderColumns(i)}</tr>);
    }
    return rows;
  };

  const onClick = (selectedNumber) => {
    const newArray = [...displayArray];
    const index = displayArray.indexOf(selectedNumber);
    const nextAppearNumber = currentNumber + NUMBER_PER_PAGE;

    const nextNumberPage = Object.keys(numArray).filter((x) =>
      numArray[x].find((xValue) => xValue === nextAppearNumber)
    );

    if (nextNumberPage.length) {
      newArray[index] =
        numArray[nextNumberPage][
          nextAppearNumber - nextNumberPage * NUMBER_PER_PAGE - 1
        ];
    } else {
      newArray[index] = '';
    }

    if (selectedNumber === currentNumber) {
      setDisplayArray(newArray);
    }

    updateCurrentNumber(selectedNumber);
  };

  const renderColumns = (row) => {
    const columns = [];
    for (let j = row * COLUMN_SIZE; j < row * COLUMN_SIZE + COLUMN_SIZE; j++) {
      columns.push(
        <td key={j} className={css.column}>
          {displayArray[j] && (
            <button
              type="button"
              onClick={() =>
                displayArray[j] === '' || freeze
                  ? null
                  : onClick(displayArray[j])
              }
              className={`${css.button} btn ${
                freeze && displayArray[j] === currentNumber ? 'btn-danger' : ''
              } ${
                freeze && displayArray[j] !== currentNumber ? 'btn-dark' : ''
              } ${!freeze ? 'btn-primary' : ''} btn-block`}
            >
              {displayArray[j]}
            </button>
          )}
        </td>
      );
    }
    return columns;
  };

  return (
    <table className={css.table}>
      <tbody>{createRow()}</tbody>
    </table>
  );
};

export default React.memo(GameTable);
