import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import TextModal from '../components/TextModal';
import { getUserStore, putUserStore } from '../helpers';
import { v4 as uuidv4 } from 'uuid';
import PresentationCard from '../components/PresentationCard';
import Container from '@mui/material/Container';
import { CssBaseline, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
const Dashboard = () => {
  const { token, handleBar } = useContext(UserContext);
  const [store, setStore] = useState({ presentations: [] });
  const [createModal, setCreateModal] = useState('');
  const navigate = useNavigate();

  const viewPresentation = async (index) => navigate(`/presentation/${index}`);

  const handleCreatePres = async (title) => {
    try {
      const store = await getUserStore(token);

      store.presentations.push({
        id: uuidv4(),
        title,
        defaultSlideTheme: '#880808',
        slides: [
          {
            texts: [],
            images: [],
            videos: [],
            codes: [],
          },
        ],
        thumbnail:
          'https://endoftheroll.com/wp-content/uploads/2022/12/dt_X714RCT28MT.jpg',
      });
      await putUserStore(token, { store });
      getData();
      handleBar('Created a new presentation', 'success');
    } catch (err) {
      handleBar('Error in created a presentatin', 'error');
    }
  };

  const getData = async () => {
    try {
      const store = await getUserStore(token);
      setStore(store);
    } catch (error) {
      handleBar('An error has occured', 'error');
    }
  };

  useEffect(() => {
    if (!token) navigate('/login');
  });

  useEffect(() => {
    if (token) getData();
  }, []);

  const handleCreatePresButton = () => setCreateModal('Create Presentation');

  return (
    <Container component='main' maxWidth='md'>
      <CssBaseline />
      &nbsp;
      <TextModal
        handleConfirm={handleCreatePres}
        open={createModal}
        btnName={'Create'}
        label='New Presentation'
        handleOptions={setCreateModal}
      />
      <Fab
        style={{ marginBottom: '5px' }}
        color='primary'
        aria-label='add'
        onClick={handleCreatePresButton}
      >
        <AddIcon />
      </Fab>
      <br />
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
    </Container>
  );
};

export default Dashboard;
