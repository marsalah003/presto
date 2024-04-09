import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { UserContext } from '../App';
import InputModal from '../components/TextModal';
import { getUserStore, putUserStore } from '../helpers';
import { v4 as uuidv4 } from 'uuid';
import PresentationCard from '../components/PresentationCard';

const Dashboard = () => {
  const { token } = useContext(UserContext);
  const [store, setStore] = useState({ presentations: [] });
  console.log(store);
  const navigate = useNavigate();

  const viewPresentation = async (index) => {
    navigate(`/presentation/${index}`);
  };

  const handleCreatePres = async (name) => {
    try {
      const {
        data: {
          store: { store },
        },
      } = await getUserStore(token);

      store.presentations.push({
        id: uuidv4(),
        name,
        slides: [{ text: 'slide 1' }],
        thumbnail: null,
      });
      await putUserStore(token, { store });
      getData();
    } catch (err) {
      console.log(err);
    }
  };

  const getData = async () => {
    console.log('hey there');
    const {
      data: {
        store: { store },
      },
    } = await axios.get(`${BACKEND_URL}/store`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setStore(store);
  };

  useEffect(getData, []);
  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/register');
  });

  return (
    <>
      &nbsp;
      <LogoutButton />
      <InputModal
        btnName={'New Presentation'}
        handleConfirm={handleCreatePres}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        {store.presentations.map(
          ({ name, slides, thumbnail, description }, index) => (
            <PresentationCard
              key={index}
              name={name}
              slides={slides}
              thumbnail={thumbnail}
              onView={() => viewPresentation(index)}
            />
          )
        )}
      </div>
      <h1> Token: {localStorage.getItem('token')}</h1>
    </>
  );
};

export default Dashboard;
