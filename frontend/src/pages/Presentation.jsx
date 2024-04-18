import React, { useContext, useEffect, useState } from 'react';
import { getUserStore, putUserStore } from '../helpers';
import { UserContext } from '../App';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import TextModal from '../components/TextModal';
import ReactPlayer from 'react-player';
import DoubleClickModal from '../components/DoubleClickModal';
import AceEditor from 'react-ace';
import ChangeSlideThemeModal from '../components/ChangeSlideThemeModal';
import CreateElementModal from '../components/CreateElementModal';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import OptionsMenu from '../components/OptionsMenu';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import RttIcon from '@mui/icons-material/Rtt';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CodeIcon from '@mui/icons-material/Code';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';

import {
  Button,
  CssBaseline,
  Container,
  Typography,
  ButtonGroup,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
const typeToProperties = {
  text: ['text', 'size', 'fontSize', 'color', 'fontFamily'],
  image: ['size', 'url', 'description'],
  video: ['size', 'url', 'autoplay'],
  code: ['text', 'size', 'fontSize'],
};
const elements = ['image', 'text', 'video', 'code'];

const Presentation = () => {
  const [slide, setSlide] = useState(0);
  const { token, handleBar } = useContext(UserContext);
  const [slideData, setSlideData] = useState({});
  const [slidePos, setSlidePos] = useState({ next: false, prev: false });
  const [texts, setTexts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [codes, setCodes] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [properties, setProperties] = useState({});
  const [open, setOpen] = useState(false);
  const [counter, setCounter] = useState(0);
  const [insertModal, setInsertModal] = useState(''); // code or text or...
  const [optionModal, setOptionModal] = useState('');
  console.log(elements);
  const { id } = useParams();

  const navigate = useNavigate();

  /* helpers */
  const hasPrevSlide = (slide) => slide !== 0;

  const hasNextSlide = async (slide) => {
    const store = await getUserStore(token);
    const slides = store.presentations[id].slides;
    if (slides[slide + 1]) return true;
    return false;
  };

  const getCur = async (type) => {
    const { presentations } = await getUserStore(token);
    if (type === 'slide') return presentations[id].slides[slide];
    return presentations[id];
  };

  /**/

  const getCurSlideData = async (newSlide) => {
    try {
      const { slides, title, defaultSlideTheme } = await getCur('pres');

      setSlideData({ ...slides[newSlide], presTitle: title });
      console.log('slides', slides[newSlide], slides[newSlide].texts);
      setTexts(slides[newSlide].texts);
      setImages(slides[newSlide].images);
      setVideos(slides[newSlide].videos);

      setCodes(slides[newSlide].codes);
      setBackgroundColor(slides[newSlide].curSlideTheme || defaultSlideTheme);

      const isNextSlide = await hasNextSlide(newSlide);
      const isPrevSlide = hasPrevSlide(newSlide);
      setSlidePos((prev) => ({ next: isNextSlide, prev: isPrevSlide }));
    } catch (err) {
      console.log(err);
      handleBar('error occured trying to fetch presentation data', 'error');
    }
  };

  useEffect(() => getCurSlideData(0), []);

  const handleDeletePres = async () => {
    const store = await getUserStore(token);
    store.presentations.splice(id, 1);
    await putUserStore(token, { store });
    navigate('/dashboard');
  };
  const updateTitle = async (newTitle) => {
    try {
      const store = await getUserStore(token);
      const curPres = store.presentations[id];
      curPres.title = newTitle;
      await putUserStore(token, { store });
      getCurSlideData(slide);
    } catch (err) {
      alert(err);
    }
  };
  const handleChangeThumbnail = async (newTN) => {
    const store = await getUserStore(token);
    const { presentations } = store;

    presentations[id].thumbnail = newTN;
    await putUserStore(token, { store });
  };
  const handleCreateSlide = async () => {
    const store = await getUserStore(token);

    store.presentations[id].slides.push({
      texts: [],
      images: [],
      videos: [],
      codes: [],
    });
    await putUserStore(token, { store });
    getCurSlideData(slide);
  };

  const handleNextSlide = () => {
    setSlide(slide + 1);
    getCurSlideData(slide + 1);
  };
  const handlePrevSlide = () => {
    setSlide((prev) => prev - 1);
    getCurSlideData(slide - 1);
  };
  const handleArrowControl = async ({ key }) => {
    if (key === 'ArrowRight' && (await hasNextSlide(slide))) handleNextSlide();
    if (key === 'ArrowLeft' && hasPrevSlide(slide)) handlePrevSlide();
  };
  const handleDeleteSlide = async () => {
    const store = await getUserStore(token);
    const currentPres = store.presentations[id];

    if (currentPres.slides.length === 1) {
      return setOptionModal('Delete Presentation');
    }
    currentPres.slides.splice(slide, 1);
    await putUserStore(token, { store });

    if (currentPres.slides[slide]) {
      getCurSlideData(slide);
    } else {
      handlePrevSlide(slide);
    }
  };

  const insertElement = async (obj, type) => {
    const store = await getUserStore(token);
    const currentPres = store.presentations[id];
    const currentSlide = currentPres.slides[slide];
    currentSlide[type].push({
      ...obj,
      pos: { left: 0, top: 0 },
      zIndex: counter,
    });
    await putUserStore(token, { store });
    setCounter((prev) => prev + 1);
    getCurSlideData(slide);
  };
  const removeElement = async (e, index, type) => {
    e.preventDefault();
    const store = await getUserStore(token);

    const currentPres = store.presentations[id];
    const currentSlide = currentPres.slides[slide];
    currentSlide[type].splice(index, 1);
    await putUserStore(token, { store });
    getCurSlideData(slide);
  };
  const handleDoubleClickElement = (properties, type, index) => {
    setProperties({ ...properties, type, index });
    setOpen(true);
  };
  const handleChangePropertiesElement = async (obj, type, index) => {
    const store = await getUserStore(token);
    const currentPres = store.presentations[id];
    const currentSlide = currentPres.slides[slide];
    currentSlide[type][index] = {
      ...obj,
      pos: { left: obj.left, top: obj.top },
    };
    await putUserStore(token, { store });
    getCurSlideData(slide);
  };
  const handleSlidesTheme = async ({ curSlideTheme, defaultSlideTheme }) => {
    const store = await getUserStore(token);
    const currentPres = store.presentations[id];

    if (defaultSlideTheme) {
      store.presentations[id].defaultSlideTheme = defaultSlideTheme;
    }

    if (curSlideTheme) currentPres.slides[slide].curSlideTheme = curSlideTheme;

    await putUserStore(token, { store });
    getCurSlideData(slide);
  };
  const handleCloseInsertModal = () => setInsertModal('');
  const handleInsertModal = (name) => {
    console.log(name);
    setInsertModal(name);
  };

  const handleOptionsModal = (option) => setOptionModal(option);

  const convertNumToPerc = (size) => `${size}%`;

  console.log(optionModal);

  return (
    <Container component='main' maxWidth='md'>
      <CssBaseline />
      <br />
      <DoubleClickModal
        handleOpen={setOpen}
        open={open}
        handleConfirm={handleChangePropertiesElement}
        properties={properties}
      />
      <Button
        size='md'
        variant='contained'
        component={Link}
        to='/dashboard'
        color='secondary'
      >
        <NavigateBeforeIcon /> &nbsp; Dashboard
      </Button>{' '}
      <ConfirmModal
        handleConfirm={handleDeletePres}
        message={'Are you sure u want to delete the current presentation?'}
        open={optionModal === 'Delete Presentation'}
        handleOptions={setOptionModal}
      />
      <br />
      <br />
      <Typography
        id='presentation-title'
        variant='h4'
        component='h3'
        sx={{ my: '15px' }}
      >
        {slideData.presTitle}
      </Typography>
      <div id='tools' style={{ display: 'flex' }}>
        <OptionsMenu
          handleModal={handleOptionsModal}
          items={[
            'Delete Presentation',
            'Update Title',
            'Update Theme',
            'Change Thumbnail',
          ]}
        />
        &nbsp;
        <ButtonGroup variant='contained' aria-label='Basic button group'>
          <Button onClick={handleCreateSlide} size='medium' variant='outlined'>
            &nbsp; <AddCircleOutlineIcon />
          </Button>
          <Button
            color='error'
            onClick={handleDeleteSlide}
            size='medium'
            variant='outlined'
          >
            <DeleteIcon />
          </Button>
        </ButtonGroup>
        &nbsp;
        <ButtonGroup variant='outlined' aria-label='Basic button group'>
          {elements.map((type, index) => (
            <Button
              name={type}
              onClick={() => handleInsertModal(type)}
              key={index}
              variant='contained'
            >
              {type === 'image' && <ImageIcon />}
              {type === 'text' && <RttIcon />}
              {type === 'video' && <PlayCircleOutlineIcon />}
              {type === 'code' && <CodeIcon />}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      <TextModal
        handleConfirm={handleChangeThumbnail}
        open={optionModal === 'Update Title'}
        handleOptions={setOptionModal}
        label={'New Title'}
        btnName={'Update Title'}
      />
      <TextModal
        handleConfirm={updateTitle}
        open={optionModal === 'Update Title'}
        handleOptions={setOptionModal}
        label={'New Title'}
        btnName={'Update Title'}
      />
      <ChangeSlideThemeModal
        handleConfirm={(obj) => handleSlidesTheme(obj)}
        open={optionModal === 'Update Theme'}
        handleOptions={setOptionModal}
      />
      <br />
      <TextModal
        handleConfirm={(v) => {
          handleChangeThumbnail(v);
        }}
        open={optionModal === 'Change Thumbnail'}
        handleOptions={setOptionModal}
        label={'New Thumbnail'}
        btnName={'Update Thumbnail'}
      />
      <CreateElementModal
        type={insertModal}
        properties={typeToProperties[insertModal] || null}
        handleConfirm={(obj) => insertElement(obj, `${insertModal}s`)}
        handleClose={handleCloseInsertModal}
      />
      <ButtonGroup
        variant='contained'
        aria-label='Basic button group'
        style={{
          display: 'flex',

          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {slidePos.prev && (
          <Button onClick={handlePrevSlide} size='large'>
            <ArrowBackIosIcon />
          </Button>
        )}
        {slidePos.next && (
          <Button onClick={handleNextSlide} size='large'>
            <ArrowForwardIosIcon />
          </Button>
        )}
      </ButtonGroup>
      <div
        id='slide'
        onKeyDown={handleArrowControl}
        tabIndex={0}
        style={{
          backgroundColor,
          marginBottom: '10px',
          height: '500px',
          position: 'relative',
          display: 'flex',
          overflow: 'hidden',
        }}
        onContextMenu={(e) => {
          console.log(e);
          e.preventDefault();
        }}
      >
        <Typography style={{ alignSelf: 'flex-end', backgroundColor: 'white' }}>
          Slide Number: {slide + 1}
        </Typography>
        {codes.map(
          ({ size, text, fontSize, pos: { left, top }, zIndex }, index) => {
            return (
              <div
                key={index}
                style={{
                  top: convertNumToPerc(top),
                  left: convertNumToPerc(left),
                  width: convertNumToPerc(size),
                  height: convertNumToPerc(size),
                  zIndex,
                  position: 'absolute',
                  border: '10px solid grey',
                }}
                onContextMenu={(e) => removeElement(e, index, 'codes')}
                onDoubleClick={() =>
                  handleDoubleClickElement(
                    { size, text, fontSize, left, top, zIndex },
                    'codes',
                    index
                  )
                }
              >
                <AceEditor
                  readOnly
                  key={index}
                  height='100%'
                  width='100%'
                  value={text}
                  fontSize={parseInt(fontSize)}
                  mode='javascript'
                  name='UNIQUE_ID_OF_DIV'
                />
              </div>
            );
          }
        )}
        {texts.map(
          (
            {
              size,
              text,
              fontSize,
              color,
              pos: { left, top },
              zIndex,
              fontFamily,
            },
            index
          ) => (
            <div
              style={{
                top: convertNumToPerc(top),
                left: convertNumToPerc(left),
                width: convertNumToPerc(size),
                height: convertNumToPerc(size),
                fontSize: `${fontSize}em`,
                color,
                zIndex,
                fontFamily,
                border: '4px solid grey',
                textAlign: 'left',
                position: 'absolute',
                overflow: 'hidden',
              }}
              onContextMenu={(e) => removeElement(e, index, 'texts')}
              key={index}
              onDoubleClick={() =>
                handleDoubleClickElement(
                  {
                    size,
                    text,
                    fontSize,
                    color,
                    zIndex,
                    fontFamily,
                    left,
                    top,
                  },
                  'texts',
                  index
                )
              }
            >
              {text}
            </div>
          )
        )}
        {images.map(
          ({ size, url, description, pos: { left, right }, zIndex }, index) => (
            <img
              key={index}
              src={url}
              alt={description}
              onContextMenu={(e) => removeElement(e, index, 'images')}
              style={{
                top: convertNumToPerc(top),
                left: convertNumToPerc(left),
                width: convertNumToPerc(size),
                height: convertNumToPerc(size),
                zIndex,
                position: 'absolute',
              }}
              onDoubleClick={() =>
                handleDoubleClickElement(
                  { size, url, description, zIndex, left, right },
                  'images',
                  index
                )
              }
            />
          )
        )}
        {videos.map(
          ({ size, url, autoplay, pos: { left, top }, zIndex }, index) => (
            <div
              style={{
                position: 'absolute',
                top: convertNumToPerc(top),
                left: convertNumToPerc(left),
                width: convertNumToPerc(size),
                height: convertNumToPerc(size),
                zIndex,
                border: '10px solid black',
              }}
              key={index}
              onContextMenu={(e) => removeElement(e, index, 'videos')}
              onDoubleClick={() =>
                handleDoubleClickElement(
                  { size, url, autoplay, zIndex, left, top },
                  'videos',
                  index
                )
              }
            >
              <ReactPlayer
                url={url.replace('watch?v=', 'embed/')}
                key={index}
                width='100%'
                height='100%'
                playing={Boolean(autoplay)}
              ></ReactPlayer>
            </div>
          )
        )}
      </div>
    </Container>
  );
};

export default Presentation;
