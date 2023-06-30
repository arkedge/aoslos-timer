import { Button, ControlGroup, InputGroup, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";

export const TimerPage: React.FC = () => {
  const [isAosTimeEditing, setIsAosTimeEditing] = useState(true);
  const [isLosTimeEditing, setIsLosTimeEditing] = useState(true);
  const [aosTimeString, setAosTimeString] = useState(
    localStorage.getItem("timer-aos-time") ?? ""
  );
  const [losTimeString, setLosTimeString] = useState(
    localStorage.getItem("timer-los-time") ?? ""
  );
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const token = setInterval(() => {
      setNow(new Date());
    }, 250);
    return () => {
      clearInterval(token);
    };
  }, []);

  const handleChangeAosTimeString = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAosTimeString(e.currentTarget.value);
    },
    []
  );
  const handleChangeLosTimeString = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLosTimeString(e.currentTarget.value);
    },
    []
  );

  const handleClickAosTimeSet = useCallback(() => {
    setIsAosTimeEditing(!isAosTimeEditing);
    if (isAosTimeEditing) {
      localStorage.setItem("timer-aos-time", aosTimeString);
    }
  }, [aosTimeString, isAosTimeEditing]);
  const handleClickLosTimeSet = useCallback(() => {
    setIsLosTimeEditing(!isLosTimeEditing);
    if (isLosTimeEditing) {
      localStorage.setItem("timer-los-time", losTimeString);
    }
  }, [isLosTimeEditing, losTimeString]);

  const aosTime = useMemo(() => {
    return new Date(aosTimeString);
  }, [aosTimeString]);
  const isAosTimeInvalid = Number.isNaN(aosTime.getTime());
  const losTime = useMemo(() => {
    return new Date(losTimeString);
  }, [losTimeString]);
  const isLosTimeInvalid = Number.isNaN(losTime.getTime());

  const [label, timer] = useMemo(() => {
    if (isAosTimeEditing || isLosTimeEditing) {
      return ["EDITING", "--:--"];
    }
    if (isAosTimeInvalid) {
      return ["INVALID AOS", "--:--"];
    }
    if (isLosTimeInvalid) {
      return ["INVALID LOS", "--:--"];
    }
    const toAosDurMs = aosTime.getTime() - now.getTime();
    const toLosDurMs = losTime.getTime() - now.getTime();
    if (toAosDurMs > 0) {
      return ["AOS", prettyMsDuration(toAosDurMs)];
    } else if (toLosDurMs >= 0) {
      return ["LOS", prettyMsDuration(toLosDurMs)];
    } else {
      return ["OVER", "--:--"];
    }
  }, [
    aosTime,
    isAosTimeEditing,
    isAosTimeInvalid,
    isLosTimeEditing,
    isLosTimeInvalid,
    losTime,
    now,
  ]);

  return (
    <div className="flex flex-col h-screen">
      <div>
        <div className="my-1 mx-2 flex flex-row items-center space-x-2">
          <span className="w-[3em]">AOS</span>
          <ControlGroup fill>
            <Button
              minimal
              icon={isAosTimeEditing ? IconNames.TARGET : IconNames.EDIT}
              onClick={handleClickAosTimeSet}
            />
            <InputGroup
              fill
              value={
                isAosTimeEditing || isAosTimeInvalid
                  ? aosTimeString
                  : aosTime.toISOString()
              }
              className="font-mono"
              placeholder="yyyy/MM/dd hh:mm:ssZ"
              onChange={handleChangeAosTimeString}
              intent={isAosTimeInvalid ? Intent.DANGER : Intent.NONE}
              readOnly={!isAosTimeEditing}
            />
          </ControlGroup>
        </div>
        <div className="my-1 mx-2 flex flex-row items-center space-x-2">
          <span className="w-[3em]">LOS</span>
          <ControlGroup fill>
            <Button
              minimal
              icon={isLosTimeEditing ? IconNames.TARGET : IconNames.EDIT}
              onClick={handleClickLosTimeSet}
            />
            <InputGroup
              fill
              value={
                isLosTimeEditing || isLosTimeInvalid
                  ? losTimeString
                  : losTime.toISOString()
              }
              className="font-mono"
              placeholder="yyyy/MM/dd hh:mm:ssZ"
              onChange={handleChangeLosTimeString}
              intent={isLosTimeInvalid ? Intent.DANGER : Intent.NONE}
              readOnly={!isLosTimeEditing}
            />
          </ControlGroup>
        </div>
      </div>
      <div className="grow flex flex-col justify-center items-center">
        <div className="text-4xl font-bold">{label}</div>
        <div className="text-8xl font-mono">{timer}</div>
      </div>
    </div>
  );
};

function prettyMsDuration(ms: number) {
  const secs = Math.floor(ms / 1000);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  if (h > 0) {
    return `${zeropad(h)}:${zeropad(m)}:${zeropad(s)}`;
  } else {
    return `${zeropad(m)}:${zeropad(s)}`;
  }
}

function zeropad(s: number) {
  return `0${s}`.slice(-2);
}
