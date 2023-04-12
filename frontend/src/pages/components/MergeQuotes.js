import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'
import axiosInstance from '../../axiosInstance';

function MergeQuotes({userId}) {

    const [quotes, setQuotes] = useState([]);
    const [selQuotes, setSelQuotes] = useState([]);

    useEffect(() => {
      axiosInstance.get(`/quotes/user_id/${userId}`)
        .then(res => setQuotes(res.data))
        .catch(err => console.log(err));
    }, [userId]);

    const handleSelect = (selectedId) => {
      const updatedQuotes = [...selQuotes];
      const index = updatedQuotes.findIndex(temp => temp === selectedId);
      if(index === -1) {
        console.log("Add " + selectedId)
        updatedQuotes.push(selectedId)
      } else if (index > -1){
        console.log("Remove " + selectedId)
        updatedQuotes.splice(index, 1)
      }
      setSelQuotes(updatedQuotes);
    }

    // function to send post to combine quotes, then redirect to new quote
    const handleCombine = () => {
      console.log(selQuotes)
      axiosInstance.post("/quotes/combine", selQuotes)
        .then(res => window.open("/quote/" + res.data.combinedQuote._id))
        .catch(err => console.log(err));
    }

    // Different way of getting quote cost compared to homepage
    function calcualteQuoteCost(quote, otc) {
      var days = 0
      switch (quote.timespan_type) {
          case "days": 
              days = quote.timespan; 
              break;
          case "weeks": 
              days = quote.timespan*7; 
              break;
          case "months": 
              days = quote.timespan*28; 
              break;
          default:
              break;
      }

      return (quote.cost)/28*days+otc
    }

    return (
      <div>
          <h2 className="heading--border">My Quotes</h2>
          <table>
              <thead>
              <tr className='tr-quote'>
                  <th width="60%">Name</th>
                  <th>Value</th>
                  <th>Combine</th>
                  <th></th>
              </tr>
              </thead>
              <tbody>
              {quotes.map((quote, index) => (
                  <tr key={quote._id} className='tr-quote'>
                    <td>
                      {quote.description}
                    </td>
                    <td>
                      £{Math.round(calcualteQuoteCost(quote, quotes[index].otc))}
                    </td>
                    <td>
                      <input type="checkbox" onChange={() => handleSelect(quote._id)} />
                    </td>
                    <td>
                      <Link to={`/quote/${quote._id}`}>View</Link>
                    </td>
                  </tr>
              ))}
              </tbody>
          </table>
          <button onClick={handleCombine} style={{"width" : "100%"}}>Combine Selected Quotes</button>
          <p style={{color: "red"}}>Note that merged quotes will have their timespan set to 1 month by default.</p>
      </div>
    );
  };
  
  export default MergeQuotes;