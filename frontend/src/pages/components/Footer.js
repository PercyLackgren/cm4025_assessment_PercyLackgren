import React from 'react';

function Footer() {
  return (
    <div className="footer">
      The total quote cost is calculated by first calculating the cost of each subtask, 
      subtasks are calculated by standardising all costs to a single month, for example, 
      if a worker has a hourly rate of £10 this value is multiplied by 8x5x4, 8 hours of work per day, 5 workdays per week, and 4 weeks per month.
      <br/><br/>
      This would then be a monthly cost of £1600, similar calculations are then performed for resources and summed togetehr to calculate a subtasks cost.
      All subtasks are then summed for the final quote.
      <br/><br/>
      Some factors of this calculation are fudged with random variables in order to prevent calculating individual rates.
    </div>
  );
}

export default Footer;
