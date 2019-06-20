import React from 'react';
import PropTypes from 'prop-types';
import DetailLot      from './detailLot';

//Gère l'affichage des lots ou de la zone cuisine puis détail la zone avec detailLot
const AffichageDesLots = (props) => {
    const { label, lignes, prixTotalHT, prixTotalTTC  } = props.data;
    return ( 
        <div className="container px-0 mx-0">
            {/* Titre */}
            <h3 className="text-center">{label}</h3>
            {/* array header */}
            <div className="row border no-gutters font-weight-bold">
                <div className="col-5">Designation</div>
                <div className="col">PU</div>
                <div className="col">unite</div>
                <div className="col">Qté</div>
                <div className="col">HT</div>
                <div className="col">taux TVA</div>
                <div className="col">TVA</div>
                <div className="col">TTC</div>
            </div>
            {/* Map sur les lignes de la zone */}
            {lignes.map(( ligne, index ) => {
                    return (
                        <DetailLot data={ligne} key={`detailLot${index}`} />
                    );
            })}
            {/* Total HT et TTC de la zone  */}
            <div className="row justify-content-end border no-gutters font-weight-bold">
                <div className="col-2">{`Total TTC : ${(prixTotalHT) ? prixTotalHT.toFixed(2) : ''} €`}</div>
            </div>
            <div className="row justify-content-end border no-gutters font-weight-bold">
                <div className="col-2">{`Total TTC : ${(prixTotalTTC) ? prixTotalTTC.toFixed(2) : ''} €`}</div>
            </div>
        </div>
    );
};

export default AffichageDesLots

AffichageDesLots.propTypes = {
    data: PropTypes.object
};
