import React from 'react';
import {Link} from 'react-router-dom'

function QuoteRow(props) {

    const quote = props.quote;

    var days = 0
    switch (props.quote.timespan_type) {
        case "days": 
            days = props.quote.timespan; 
            break;
        case "weeks": 
            days = props.quote.timespan*7; 
            break;
        case "months": 
            days = props.quote.timespan*28; 
            break;
    }

    return (
      
      <tr className='tr-quote'>
        <td>{quote.user_id}</td>
        <td>{quote.description}</td>
        {/* <td>{quote.sub_id}</td> */}
        <td>£{Math.round(quote.cost/28*days)}</td>
        <td><Link to={`/quote/${quote._id}`}>View</Link></td>
      </tr>
  
    );
  }
  
  export default QuoteRow;