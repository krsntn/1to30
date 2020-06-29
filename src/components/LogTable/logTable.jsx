import React, { useState, useEffect } from 'react';
import css from './logTable.module.scss';
import firebase from 'firebase';
import { startDB } from '../utils/firebase-config';

startDB();
const database = firebase.database();
const logDB = database.ref('log30');

function errData(err) {
  console.error(err);
}

const weekday = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const LogTable = (props) => {
  const [data, setData] = useState([]);

  const gotData = (data) => {
    const localData = [];
    const records = data.val();
    if (records) {
      const keys = Object.keys(records);
      for (const key of keys) {
        localData.push(records[key]);
      }
      const finalOutput = localData.sort((a, b) =>
        a.speed > b.speed ? 1 : -1
      );
      setData(finalOutput);
    }
  };

  useEffect(() => {
    if (logDB) {
      logDB.on('value', gotData, errData);
    }
  }, []);

  const convertDateTime = (datetime) => {
    if (datetime) {
      const dataTime = new Date(datetime);
      return `${dataTime.getFullYear()}/${dataTime.getMonth() +
        1}/${dataTime.getDate()} ${
        weekday[dataTime.getDay()]
      } ${dataTime.getHours()}:${dataTime.getMinutes()}:${(
        '0' + dataTime.getSeconds()
      ).slice(-2)}`;
    }
    return '';
  };

  const displayDevice = (data) => {
    if (data) {
      const output = [];
      const keys = Object.keys(data);

      let index = 0;
      for (const key of keys) {
        const item = data[key];
        const childKeys = Object.keys(data[key]);

        for (const childKey of childKeys) {
          output.push(
            <div key={index++}>{`${childKey}: ${item[childKey] || '-'}`}</div>
          );
        }
      }
      return output;
    }
  };

  const displayGeolocation = (data) => {
    if (data) {
      const output = [];
      const keys = Object.keys(data);

      let index = 0;
      for (const key of keys) {
        output.push(<div key={index++}>{`${key}: ${data[key] || '-'}`}</div>);
      }
      return output;
    }
  };

  const createAccordion = () => {
    if (data.length > 0) {
      const accordian = (
        <div className="accordion" id={`accordion${1}`}>
          {data.map((record, index) => {
            return (
              <div key={index} className="card">
                {createCard(record, index)}
              </div>
            );
          })}
        </div>
      );
      return accordian;
    }
  };

  const createCard = (data, index) => {
    return (
      <>
        <div className="card-header" id={`heading${index}`}>
          <h2 className="mb-0">
            <button
              type="button"
              className="btn btn-link collapsed"
              data-toggle="collapse"
              data-target={`#collapse${index}`}
              aria-expanded="false"
              aria-controls={`collapse${index}`}
            >
              {convertDateTime(data.time)} ({data.geolocation.region}
              {', '}
              {data.geolocation.country_name})
            </button>
          </h2>
        </div>
        <div
          id={`collapse${index}`}
          className="collapse"
          aria-labelledby={`heading${index}`}
          data-parent="#accordion1"
        >
          <div className="card-body">
            <div className={css.recordContainer}>
              <div>{displayDevice(data.device)}</div>
              <div>{displayGeolocation(data.geolocation)}</div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return <div className={css.container}>{createAccordion()}</div>;
};

export default LogTable;
