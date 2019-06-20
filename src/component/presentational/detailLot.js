import React from 'react';
import PropTypes from 'prop-types';

//Affiche le détail du lot ou de la zone travaux
const DetailLot = (props) => {
    const { designation, description, prixUnitaireHT, quantite, unite, prixHT, tauxTVA, montantTVA, prixTTC } = props.data;
    return ( 
        <div className="row border no-gutters">
            <div className="col-5">
            <div>{designation}</div>
            <h6><small>{description}</small></h6>
            </div>
            <div className="col">{prixUnitaireHT.toFixed(2)} €</div>
            <div className="col">{unite}</div>
            <div className="col">{quantite.toFixed(2)}</div>
            <div className="col">{prixHT.toFixed(2)} €</div>
            <div className="col">{tauxTVA}%</div>
            <div className="col">{montantTVA.toFixed(2)} €</div>
            <div className="col">{prixTTC.toFixed(2)} €</div>
        </div>
    );
};

export default DetailLot

DetailLot.propTypes = {
    data: PropTypes.object
};
