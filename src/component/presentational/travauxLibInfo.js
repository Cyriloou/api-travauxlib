import React from 'react';
import PropTypes from 'prop-types';

//Affiche les informations de la société (en haut à droite du devis)
const TravauxLibInfo = (props) => {
    const { name, email, logoUrl, formattedSiret, siren, numeroTVA, phoneNumber, address, postalCode, city } = props.data;
    return ( 
        <div className="container">
            <img src={logoUrl} height="60" alt="logo" />
            <div className="container"> 
                <div>{name}</div>
                <div> {address}</div>
                <div> {postalCode} {city}</div>
                <div> {(email) ? `email : ${email}` : null}</div>
                <div> {(phoneNumber) ? `Tel : ${phoneNumber}` : null}</div>
                <div> {(formattedSiret) ? `SIRET : ${formattedSiret}` : null}</div>
                <div> {(siren) ? `SIREN : ${siren}` : null}</div>
                <div> {(numeroTVA) ? `TVA : ${numeroTVA}` : null}</div>
            </div>
        </div>
    );
};

export default TravauxLibInfo

TravauxLibInfo.propTypes = {
    data: PropTypes.object
};
