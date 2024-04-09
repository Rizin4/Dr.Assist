import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './Box.css';

function HomeUser() {

        const cardInfo = [
            {image: 
                "https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsb2ZmaWNlNl9hX3Bob3RvX29mX2FfbWlkZGxlX2FnZV9tYWxlX2luZGlhbl9kb2N0b3JfaXNvbF8wZTAzNGE0YS1iMWU1LTQxOTEtYmU0Zi1iYmE2NWJkMjNmMmEucG5n.png"
                , title: "Doc1", text: "Physician"},
            {image: 
                "https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg"
                , title: "Doc2", text: "Surgeon"},
            {image: 
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNpR7Fh3l_A1PbjVTYpvxe2R2DBPzl-IB-ohtGYkAWkg&s"
                , title: "Doc3", text: "Orthopedic Surgeon"},
            {image: 
                "https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg?size=338&ext=jpg&ga=GA1.1.1700460183.1712620800&semt=sph"
                , title: "Doc4", text: "Pediatrician"},

        ];

 const renderCard = (card, index) => {
  return (
  
    <Card style={{ width: '14rem' }} key={index} className='box'>
      <Card.Img variant="top" src="holder.js/100px180" src={card.image} className='card-img-top'/>
      <Card.Body>
        <Card.Title>{card.title}</Card.Title>
        <Card.Text>
            {card.text}
        </Card.Text>
        <Button variant="primary" >Choose this Doctor</Button>
      </Card.Body>
    </Card>

  );
}

return (
  
    <div className="grid" >
      {cardInfo.map(renderCard)}
    </div>
  
);
};
export default HomeUser;