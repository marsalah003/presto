import React, { useContext, useEffect, useRef, useState } from 'react';
import { getUserStore, putUserStore } from '../helpers';
import { UserContext } from '../App';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import TextModal from '../components/TextModal';
import TextBoxModal from '../components/TextBoxModal';
const Presentation = () => {
  const [slide, setSlide] = useState(0);
  const { token } = useContext(UserContext);
  const [thumbNail, setThumbNail] = useState(null);
  const [slideData, setSlideData] = useState({});
  const [slidePos, setSlidePos] = useState({ next: false, prev: false });
  const [textBoxes, setTextBoxes] = useState([]);
  const { id } = useParams();

  const navigate = useNavigate();
  const ref = useRef(null);
  const hasPrevSlide = (slide) => slide !== 0;
  const hasNextSlide = async (slide) => {
    const {
      data: { store },
    } = await getUserStore(token);
    const slides = store.presentations[id].slides;
    if (slides[slide + 1]) return true;
    return false;
  };
  const getCurSlideData = async (newSlide) => {
    try {
      const {
        data: {
          store: { presentations },
        },
      } = await getUserStore(token);
      const { slides, title, thumbnail } = presentations[id];

      setSlideData({ ...slides[newSlide], presTitle: title });
      setThumbNail(thumbnail);
      setTextBoxes(slides[newSlide].textBoxes);
      const isNextSlide = await hasNextSlide(newSlide);
      const isPrevSlide = hasPrevSlide(newSlide);
      setSlidePos((prev) => ({ next: isNextSlide, prev: isPrevSlide }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => getCurSlideData(0), []);
  const handleDeletePres = async () => {
    const {
      data: { store },
    } = await getUserStore(token);
    store.presentations.splice(id, 1);
    await putUserStore(token, { store });
    navigate('/dashboard');
  };
  const updateTitle = async (newTitle) => {
    try {
      const {
        data: { store },
      } = await getUserStore(token);
      const curPres = store.presentations[id];
      curPres.title = newTitle;
      await putUserStore(token, { store });
      setSlideData((prev) => ({ ...prev, presTitle: newTitle }));
    } catch (err) {
      console.log(err);
    }
  };
  const handleChangeThumbnail = async () => {
    const {
      data: { store },
    } = await getUserStore(token);
    const { presentations } = store;

    presentations[id].thumbnail = thumbNail;
    await putUserStore(token, { store });
  };
  const handleCreateSlide = async () => {
    const {
      data: { store },
    } = await getUserStore(token);
    const { presentations } = store;
    const slides = presentations[id].slides;
    slides.push({ text: 'new slide', textBoxes: [] });
    await putUserStore(token, { store });
    getCurSlideData(slide);
  };

  const handleNextSlide = () => {
    setSlide(slide + 1);
    getCurSlideData(slide + 1);
    console.log(slide);
  };
  const handlePrevSlide = () => {
    setSlide((prev) => prev - 1);
    getCurSlideData(slide - 1);
  };
  const handleArrowControl = async ({ key }) => {
    if (key === 'ArrowRight') {
      console.log(hasNextSlide(slide));
      if (await hasNextSlide(slide)) handleNextSlide();
    } else if (key === 'ArrowLeft') {
      console.log(hasPrevSlide(slide));
      if (hasPrevSlide(slide)) handlePrevSlide();
    }
  };
  const handleDeleteSlide = async () => {
    const {
      data: { store },
    } = await getUserStore(token);
    console.log('hello');
    const currentPres = store.presentations[id];

    if (currentPres.slides.length === 1) {
      ref.current.click();
      return;
    }
    currentPres.slides.splice(slide, 1);
    await putUserStore(token, { store });

    if (currentPres.slides[slide]) {
      getCurSlideData(slide);
    } else {
      handlePrevSlide(slide);
    }
  };
  const handleCreateTextBox = async (newTextBoxObj) => {
    const {
      data: { store },
    } = await getUserStore(token);
    const currentPres = store.presentations[id];
    const currentSlide = currentPres.slides[slide];
    currentSlide.textBoxes.push(newTextBoxObj);
    await putUserStore(token, { store });
    setTextBoxes((prev) => [...prev, newTextBoxObj]);
  };
  console.log(textBoxes);
  const handleRightClickElement = async (e, index) => {
    e.preventDefault();
    const {
      data: { store },
    } = await getUserStore(token);

    const currentPres = store.presentations[id];
    const currentSlide = currentPres.slides[slide];
    currentSlide.textBoxes.splice(index, 1);
    await putUserStore(token, { store });
    getCurSlideData(slide);
  };
  return (
    <div onKeyDown={handleArrowControl} tabIndex={0}>
      <br />
      <Link to='/dashboard'> Go back to dashboard</Link> <br />
      <ConfirmModal
        handleConfirm={handleDeletePres}
        message={'Are you sure u want to delete the current pres?'}
        myRef={ref}
      />
      <TextModal
        btnName='Update title of presentation'
        handleConfirm={updateTitle}
      />
      <TextBoxModal
        btnName='Add Text Box'
        handleConfirm={handleCreateTextBox}
      />
      <button onClick={handleCreateSlide}>Create a new slide</button>
      <br />
      <button onClick={handleDeleteSlide}>Delete slide</button>
      <div>
        {' '}
        Presentation Title: {slideData.presTitle} <br />
        Current Slide Content: {slideData.text} <br />
        Slide Number {slide + 1}
      </div>
      <br />
      Change Thumbnail:
      <input
        type='text'
        value={thumbNail || ''}
        onChange={({ target: { value } }) => setThumbNail(value)}
      />
      <button onClick={handleChangeThumbnail}> Change Thumbnail</button>
      <br /> <br />
      {slidePos.next && <button onClick={handleNextSlide}> Next Slide</button>}
      {slidePos.prev && <button onClick={handlePrevSlide}> Prev Slide</button>}
      <div
        id='slide'
        style={{
          backgroundColor: 'red',
          width: '500px',
          height: '500px',
          position: 'relative',
        }}
      >
        {textBoxes.map(({ size, text, fontSize, colour }, index) => (
          <div
            style={{
              width: `${size}%`,
              height: `${size}%`,
              fontSize: `${fontSize}em`,
              color: colour,
              backgroundColor: 'grey',
              textAlign: 'left',
              position: 'absolute',
              left: '0%',
              up: '0%',
            }}
            onContextMenu={(e) => handleRightClickElement(e, index)}
            key={index}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Presentation;
