import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';

// components
import QuoteRow from './components/QuoteRow';

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
        console.log('No quotes')
    } else {
        quoteList = quotes.map((quote, k) => <QuoteRow quote={quote} key={k}></QuoteRow> )
    }
    
    return (
        <div>
            <div class="container"> 
                <br/>
                <h1 class="heading--border">Quotes</h1>
                <br/>
                <table>
                    <tr>
                        <th>Author</th>
                        <th>description</th>
                        <th>Subtasks</th>
                        <th>Quote</th>
                        <th></th>
                    </tr>
                    {quoteList}
                </table>
            </div>
        </div>
    )
}

export default Home;