import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import { UserContext } from '../App';
import TextModal from '../components/TextModal';
import { getUserStore, putUserStore } from '../helpers';
import { v4 as uuidv4 } from 'uuid';
import PresentationCard from '../components/PresentationCard';

const Dashboard = () => {
  const { token } = useContext(UserContext);
  const [store, setStore] = useState({ presentations: [] });
  const navigate = useNavigate();

  const viewPresentation = async (index) => {
    navigate(`/presentation/${index}`);
  };

  const handleCreatePres = async (title) => {
    try {
      const {
        data: { store },
      } = await getUserStore(token);

      store.presentations.push({
        id: uuidv4(),
        title,
        slides: [{ text: 'slide 1', textBoxes: [] }],
        thumbnail:
          'https://endoftheroll.com/wp-content/uploads/2022/12/dt_X714RCT28MT.jpg',
      });
      await putUserStore(token, { store });
      getData();
    } catch (err) {
      console.log(err);
    }
  };

  const getData = async () => {
    const {
      data: { store },
    } = await getUserStore(token);
    setStore(store);
  };

  useEffect(getData, []);
  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/register');
  });
  console.log(store);
  return (
    <>
      &nbsp;
      <LogoutButton />
      <TextModal
        btnName={'New Presentation'}
        handleConfirm={handleCreatePres}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        {store.presentations.map(
          ({ title, slides, thumbnail, description }, index) => (
            <PresentationCard
              key={index}
              name={title}
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
