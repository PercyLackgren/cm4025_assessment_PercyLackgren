import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';

// components
import QuoteRow from './components/QuoteRow';

axios.defaults.withCredentials = true

function Home() {

    const [quotes, setQuotes] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/quotes').then((res) => {
            setQuotes(res.data);
        }).catch((err) => {
            console.log('Error pulling quotes')
        });
    }, []);

    var quoteList

    if(quotes.length === 0) {
        // console.log('No quotes')
    } else {
        quoteList = quotes.map((quote, k) => <QuoteRow quote={quote} key={k}></QuoteRow> )
    }

    // console.log(quoteList)

    return (
        <div>
            <div className="container"> 
                <br/>
                <h1 className="heading--border">Quotes</h1>
                <br/>
                <table>
                    <thead>
                        <tr className='tr-quote'>
                            <th>Author</th>
                            <th>description</th>
                            {/* <th>Subtasks</th> */}
                            <th>Quote</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {quoteList}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Home;