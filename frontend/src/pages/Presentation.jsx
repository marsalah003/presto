import React, { useContext, useEffect, useState } from 'react';
import { getUserStore } from '../helpers';
import { UserContext } from '../App';
import { useSearchParams } from 'react-router-dom';
const Presentation = () => {
  const [slide] = useState(0);
  const [searchParams] = useSearchParams();
  const { token } = useContext(UserContext);
  const [slideData, setSlideData] = useState({});

  console.log(slideData, slide);

  const getCurSlideData = async () => {
    try {
      const {
        data: {
          store: {
            store: { presentations },
          },
        },
      } = await getUserStore(token);

      const slideIndex = searchParams.get('id');
      setSlideData(presentations[slideIndex]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(getCurSlideData, []);

  return <h1> This is the presentation screen</h1>;
};

export default Presentation;
