import React from 'react';
import PropTypes from 'prop-types';
import AffichageDesLots     from '../presentational/affichageDesLots';

//Don't forget to pass props to a stateless component as a argument.
const AffichageParPiece = (props) => {
    const { locations, lots} = props;
    let newLots = {}
    locations.forEach(function(location) {
        newLots[location.uuid] = {};
        newLots[location.uuid].label = location.label; 
        newLots[location.uuid].key = location.uuid; 
        newLots[location.uuid].surface = location.surface;
        newLots[location.uuid].lignes = [];
    });

    newLots.other = {};
    newLots.other.label = "Autres prestations"
    newLots.other.lignes = [];

    console.log('newLots ', newLots)

    lots.forEach(function(lot) {
        console.log('lot ', lot)
        let lignes = lot.lignes
        lignes.forEach(function(ligne) {
            console.log('ligne ', ligne)
            let locations = ligne.locationsDetails.locations
            if (locations.length === 0){
                let newLignes = ligne
                delete newLignes.locationsDetails;
                newLots.other.lignes.push(newLignes);
                console.log('newLignes ', newLignes)
            }else{
                locations.forEach(function(location) {
                    let newLignes = ligne
                    delete newLignes.locationsDetails
                    newLignes.quantite = location.quantite
                    newLots[location.uuid].lignes.push(newLignes);
                    console.log('newLignes ', newLignes)
                })
            }
        })
    });
    console.log(newLots);

    newLots.forEach((lot)  => {
        return (
            <AffichageDesLots data={lot} key={`${lot.key}`} />
        );
    })


    return ( 
        <div className="container px-0 mx-0">
        </div>
    );
};

export default AffichageParPiece

AffichageParPiece.propTypes = {
    locations: PropTypes.object,
    sections: PropTypes.object
};
