import React, { useState, useEffect, useCallback } from 'react';
import GameTable from '../GameTable';
import Leaderboard from '../Leaderboard';
import css from './main.module.scss';
import firebase from 'firebase';
import DeviceDetector from 'device-detector-js';
import { startDB } from '../utils/firebase-config';
import blockedNames from '../utils/blockedNames';

startDB();
const database = firebase.database();
const leaderboardDB = database.ref('leaderboard30');
const logDB = database.ref('log30');
const deviceDetector = new DeviceDetector();

const TOTAL_NUMBER = 30;

function errData(err) {
  console.error(err);
}

const Main = () => {
  const [currentNumber, setCurrentNumber] = useState(1);
  const [time, setTime] = useState(0);
  const [intervalId, setIntervalId] = useState();
  const [gameStatus, setGameStatus] = useState(0); // 0: ready, 1: game started, 2: game over
  const [freeze, setFreeze] = useState(false);
  const [data, setData] = useState([]);

  const gotData = (data) => {
    const localData = [];
    const records = data.val();
    if (records) {
      const keys = Object.keys(records);
      for (const key of keys) {
        localData.push({ name: key, ...records[key] });
      }
      const finalOutput = localData.sort((a, b) =>
        a.speed > b.speed ? 1 : -1
      );
      setData(finalOutput);
    }
  };

  const updateCurrentNumber = useCallback(
    (selectedNumber) => {
      if (selectedNumber === currentNumber) {
        if (currentNumber !== TOTAL_NUMBER) {
          setCurrentNumber((prevState) => ++prevState);
        } else {
          // win
          setCurrentNumber('Finished');
          setGameStatus(2);
        }
      } else {
        // lose
        clearInterval(intervalId);
        setFreeze(true);
        setTime(0);
      }
    },
    [currentNumber, intervalId]
  );

  useEffect(() => {
    leaderboardDB
      .orderByChild('speed')
      .limitToFirst(20)
      .on('value', gotData, errData);
  }, []);

  useEffect(() => {
    if (gameStatus === 1 && intervalId === undefined) {
      // start game
      setFreeze(false);
      setTime(0);
      setCurrentNumber(1);
      const id = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
      setIntervalId(id);
    } else if (gameStatus === 0) {
      // back to menu
      clearInterval(intervalId);
      setIntervalId();
      setTime(0);
    } else if (gameStatus === 2) {
      // end game
      clearInterval(intervalId);
      setIntervalId();
    }
  }, [gameStatus, intervalId]);

  const startGame = () => {
    fetch('https://ipapi.co/json/')
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const device = deviceDetector.parse(window.navigator.userAgent);
          const log = {
            time: firebase.database.ServerValue.TIMESTAMP,
            geolocation: {
              ip: data.ip,
              city: data.city,
              region: data.region,
              region_code: data.region_code,
              country: data.country,
              country_code: data.country_code,
              country_name: data.country_name,
              postal: data.postal,
              latitude: data.latitude,
              longitude: data.longitude,
              timezone: data.timezone,
              country_calling_code: data.country_calling_code,
              currency: data.currency,
              asn: data.asn,
              org: data.org,
            },
            device: device,
          };
          logDB.push(log);
        }
      });

    setGameStatus(1);
  };

  const resetGame = () => {
    setGameStatus(0);
    setCurrentNumber(1);
    setFreeze(false);
  };

  const submitName = (event) => {
    event.preventDefault();
    const name = document.querySelector('#inlineFormInputName').value;

    if (
      name.trim().length === 0 ||
      name.length > 30 ||
      blockedNames.includes(name)
    ) {
      alert('Invalid name.');
      return;
    }

    const newData = {
      speed: time / 1000,
      time: firebase.database.ServerValue.TIMESTAMP,
    };

    firebase
      .database()
      .ref(`leaderboard30/${name}`)
      .once('value', (data) => {
        if (data.val()) {
          const record = data.val();
          if (newData.speed < record.speed) {
            database.ref(`leaderboard30/${name}`).set(newData);
          }
        } else {
          database.ref(`leaderboard30/${name}`).set(newData);
        }
      });

    resetGame();
  };

  return (
    <div className={css.container}>
      <div className={css.time}>{(time / 1000).toFixed(2)}</div>
      <div
        className={`${css.currentNumber} text-light ${
          !freeze && currentNumber === 'Finished' ? 'bg-success' : ''
        } ${!freeze && currentNumber !== 'Finished' ? 'bg-primary' : ''} ${
          freeze ? 'bg-danger' : ''
        } font-weight-bold`}
      >
        {freeze ? 'Game Over' : currentNumber}
      </div>
      <div className={css.box}>
        {gameStatus === 0 && (
          <button
            className={`${css.startButton} text-light bg-primary`}
            onClick={startGame}
          >
            Start Game
          </button>
        )}
        {gameStatus === 1 && (
          <GameTable
            currentNumber={currentNumber}
            updateCurrentNumber={updateCurrentNumber}
            freeze={freeze}
            TOTAL_NUMBER={TOTAL_NUMBER}
          />
        )}
        {gameStatus === 2 && currentNumber === 'Finished' && (
          <div className={`${css.winBox} text-light bg-success`}>
            <span className={`d-block mb-5`}>
              You {currentNumber === 'Finished' ? 'Win!' : 'Lose'}
            </span>
            <span className={`d-block`}>
              Your Time: {(time / 1000).toFixed(2)}
            </span>
            <form className={`form-inline`}>
              <div className={`form-row align-items-center`}>
                <div className="my-1">
                  <label className="sr-only" htmlFor="inlineFormInputName">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inlineFormInputName"
                    placeholder="Name"
                  />
                </div>
                <div className="col-auto my-1">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={submitName}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
            <button className={`btn btn-light mt-5`} onClick={resetGame}>
              Reset
            </button>
          </div>
        )}
      </div>

      {gameStatus === 1 && (
        <button
          type="button"
          className={`btn btn-dark btn-lg btn-block`}
          onClick={resetGame}
        >
          Reset
        </button>
      )}

      <div className={css.leaderboardContainer}>
        Leaderboard
        <Leaderboard data={data} />
      </div>
    </div>
  );
};

export default Main;
