import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const TextBoxModal = ({ btnName, handleConfirm }) => {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    size: 0,
    text: '',
    fontSize: '',
    colour: '',
  });
  const handleForm = ({ target: { value, name } }) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>{btnName}</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Size of text area
          </Typography>
          <input
            type='number'
            name='size'
            onChange={handleForm}
            value={form.size}
          />
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Text:
          </Typography>
          <textarea
            name='text'
            id=''
            cols='30'
            rows='10'
            value={form.text}
            onChange={handleForm}
          ></textarea>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Font Size:
          </Typography>
          <input
            type='number'
            name='fontSize'
            onChange={handleForm}
            value={form.fontSize}
          />
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Colour:
          </Typography>
          <input
            type='text'
            name='colour'
            onChange={handleForm}
            value={form.colour}
          />
          <br />
          <button
            onClick={() => {
              handleConfirm(form);
              handleClose();
            }}
          >
            {' '}
            Create text box
          </button>
        </Box>
      </Modal>
    </div>
  );
};
export default TextBoxModal;
