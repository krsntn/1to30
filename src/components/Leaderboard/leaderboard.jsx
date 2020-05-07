import React from 'react';
import css from './leaderboard.module.scss';

const Leaderboard = (props) => {
  const { data } = props;

  const createRow = () => {
    let rows = [];
    if (data.length > 0) {
      rows = data.map((record, index) => {
        return (
          <tr key={index}>
            <th className="pb-2" scope="row">
              {index + 1}
            </th>
            <td>
              <div className={css.name} data-name={record.name}>
                {record.name}
              </div>
            </td>
            <td className={`text-primary`}>
              {parseFloat(record.speed).toFixed(2)}
            </td>
          </tr>
        );
      });
    } else {
      rows.push(
        <tr key={1} className={css.emptyRow}>
          <th scope="row" colSpan="100%">
            <div className={css.lds_ellipsis}>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </th>
        </tr>
      );
    }
    return rows;
  };

  return (
    <table className={`${css.table} table table-borderless`}>
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">Name</th>
          <th scope="col">Speed</th>
        </tr>
      </thead>
      <tbody>{createRow()}</tbody>
    </table>
  );
};

export default React.memo(Leaderboard);
