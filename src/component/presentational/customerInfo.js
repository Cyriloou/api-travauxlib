
import React from 'react';
import PropTypes from 'prop-types';

//Don't forget to pass props to a stateless component as a argument.
const CustomerInfo = (props) => {
    const { customerName, customerEmail, billingAddress } = props.data;
    return ( 
        <div className="container">
            <div> {customerName}</div>
            <div> {billingAddress.address}</div>
            <div> {billingAddress.postalCode} {billingAddress.city}</div>
            <div> {(customerEmail) ? `email : ${customerEmail}` : null}</div>
        </div>
    );
};

export default CustomerInfo

CustomerInfo.propTypes = {
    data: PropTypes.object
};