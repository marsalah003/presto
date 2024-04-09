import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const PresentationCard = ({ name, slides, thumbnail, description, onView }) => (
  <Card sx={{ minWidth: 100, maxWidth: 300 }}>
    <CardMedia
      sx={{ height: 140 }}
      image={
        thumbnail ||
        'https://endoftheroll.com/wp-content/uploads/2022/12/dt_X714RCT28MT.jpg'
      }
      title={`presentation ${name}`}
    />
    <CardContent>
      <Typography gutterBottom variant='h5' component='div'>
        {name}
      </Typography>
      <Typography variant='body2' color='text.secondary'>
        {slides.length} slides
      </Typography>
      <Typography variant='body3' color='text.secondary'>
        {description}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size='small'>Share</Button>
      <Button size='small' onClick={onView}>
        View
      </Button>
    </CardActions>
  </Card>
);

export default PresentationCard;
