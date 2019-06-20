
import React from 'react';
import PropTypes from 'prop-types';

//Affiche le détail des infos du client (en haut a gauche du devis)
const CustomerInfo = (props) => {
    const { customerName, customerEmail, billingAddress } = props.data;
    return ( 
        <div className="container">
            <div>{customerName}</div>
            <div>{billingAddress.address}</div>
            <div>{billingAddress.postalCode} {billingAddress.city}</div>
            <div>{(customerEmail) ? `email : ${customerEmail}` : null}</div>
        </div>
    );
};

export default CustomerInfo

CustomerInfo.propTypes = {
    data: PropTypes.object
};