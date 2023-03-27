import React from 'react';
import {Link} from 'react-router-dom'

function quoteRow(props) {

    const quote = props.quote;

    return (
      
      <tr>
        <td>{quote.user_id}</td>
        <td>{quote.type}</td>
        <td>{quote.sub_id}</td>
        <td>{quote.cost}</td>
        <td><Link to={`/quote/${quote._id}`}>View</Link></td>
      </tr>
  
    );
  }
  
  export default quoteRow;