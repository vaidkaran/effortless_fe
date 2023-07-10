import React from 'react';
import { useSelector } from "react-redux";
import { getResCode } from '../store/reqDataSlice';

export default function ResponseTitle() {
  const resCode = useSelector(getResCode);
  const color = resCode < 400 ? 'green' : 'red';

    return (
      <p>
        Response&nbsp;&nbsp;&nbsp;&nbsp;
        <b>
          {resCode ? <span style={{color}}>{resCode}</span>: <></>}
        </b>
      </p>
    )
  // }
}