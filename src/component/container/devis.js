import React from "react";
// import './devis.css'
import CustomerInfo         from '../presentational/customerInfo';
import TravauxLibInfo       from '../presentational/travauxLibInfo';
import AffichageDesLots     from '../presentational/affichageDesLots';

class Devis extends React.Component{

	constructor(){
		super();
		this.state = { 
			'loading': true,
            'devis': [],
            isToggleOn: true,
            QuoteRooms : []
        };
        this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount(){
        // Charge les infos du devis via la clé
        this.getDevis('JKusHl8Ba8MABIjdCtLZOe2lxxnUfX');
    }
    
    handleClick() {
        //On click change the toggle
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }));
    }

    affichageDevisPieces(devis){
        //Refaire le devis par zone cuisine
        const { QuoteRooms  } = this.state;
        //Si le devis n'est pas déjà converti
        if (QuoteRooms !== []){
            //valeur tampon
            let newQuoteRooms = {}
            let locations = devis.locations
            let lots = devis.sections[0].lots
            //Pour chaque zone, on récupère les infos sous une key = id de la zone. Ce sera plus facile à traiter lorsque l'on loop sur les lots
            //On stock sous la même format que les lots pour réutiliser le module des lots 
            locations.forEach((location) => {
                newQuoteRooms[location.uuid] = {};
                newQuoteRooms[location.uuid].label = location.label; 
                newQuoteRooms[location.uuid].key = location.uuid; 
                newQuoteRooms[location.uuid].surface = location.surface;
                newQuoteRooms[location.uuid].lignes = [];
                newQuoteRooms[location.uuid].prixTotalHT = 0 ;
                newQuoteRooms[location.uuid].prixTotalTTC = 0 ;
            });
            //On ajoute la zone Autres prestations
            newQuoteRooms.other = {};
            newQuoteRooms.other.label = "Autres prestations";
            newQuoteRooms.other.key = "AutresPrestations";
            newQuoteRooms.other.lignes = [];
            newQuoteRooms.other.prixTotalHT = 0 ;
            newQuoteRooms.other.prixTotalTTC = 0 ;
            //On loop sur chaque lot pour en extraires les lignes et les retravailler par zone chantier
            lots.forEach((lot) => {
                let lignes = lot.lignes
                //On loop sur les lignes
                lignes.forEach((ligne) => {
                    let locations = ligne.locationsDetails.locations;
                    //S'il n'y a pas de zone définie, on glisse dans "Autres prestations"
                    if (locations.length === 0){
                        //On copie la ligne
                        let newLignes = ligne
                        console.log('ligne ', ligne )
                        //On supprime la clé locationsDetails qui ne sert plus
                        delete newLignes.locationsDetails;
                        //On ajoute cette ligne à notre objet tampon
                        newQuoteRooms.other.lignes.push(newLignes);
                        //On refait les math pur avoir le total de la zone
                        newQuoteRooms.other.prixTotalHT += parseInt(ligne.prixHT); 
                        newQuoteRooms.other.prixTotalTTC += parseInt(ligne.prixTTC);
                    }else{
                        locations.forEach((location) => {
                            //On copie la ligne
                            let newLignes = ligne
                            //On supprime la clé locationsDetails qui ne sert plus
                            delete newLignes.locationsDetails
                            //On met à jour le quantité
                            newLignes.quantite = location.quantite
                            console.log('newLignes.prixHT ', location.prixUnitaireHT)
                            //On refait les math pour mettre à jour les prix
                            newLignes.prixHT = ligne.prixUnitaireHT * ligne.quantite
                            newLignes.prixTTC = ligne.prixUnitaireHT * ligne.quantite + ligne.montantTVA
                            //On ajoute cette ligne à notre objet tampon
                            newQuoteRooms[location.uuid].lignes.push(newLignes);
                            //On refait les math pur avoir le total de la zone
                            newQuoteRooms[location.uuid].prixTotalHT += parseInt(ligne.prixHT); 
                            newQuoteRooms[location.uuid].prixTotalTTC += parseInt(ligne.prixTTC);
                        })
                    }
                })
            });
            console.log('newQuoteRooms ', newQuoteRooms);
            let temp = [];
            //On simplifie le tableau pour retirer les clé id qui ne servent plus
            for (let [key, value] of Object.entries(newQuoteRooms)) {
                temp.push(value);
                if (key === 'other'){
                    this.setState({
                        QuoteRooms : temp
                    }, () => {
                    console.log('temp ', this.state.QuoteRooms)})
                }
            }
        }
    }

	getDevis(key){
        //On recupere le devis JSON sur le lien
		fetch('https://api.travauxlib.com/api/devis-pro/' + key)
			.then(results => results.json())
			.then(results => {
                this.setState({
                    //Le devis est récupéré, on sauve le resultat et on arret de charger
                    'devis': results,
                    'loading': false
                })
                //On affiche le devis
                this.affichageDevisPieces(results)
            });
    }
    


	render(){
        const { devis, loading, isToggleOn } = this.state;
        //Si le devis est en cours de chargement, on affiche un chargement
        if(loading) {
            return(<div className="container text-center">Loading...</div>)
        }else{
            return (
                <div className="container px-0 mx-auto">
                    {/* Entete devis */}
                    <div className="row py-3">
                        <div className="col">
                            {/* Partie client */}
                            <CustomerInfo data={devis.deal || {}}/>
                        </div>
                        <div className="col">
                            {/* Parie Société */}
                            <TravauxLibInfo data={devis.company || {}}/>
                        </div>
                    </div>
                    {/* Titre du devis + lettre d'accompagnement */}
                    <h1 className="text-center">{devis.title}</h1>
                    <div className="post__content" dangerouslySetInnerHTML={{__html: devis.introductionLetter.replace(/(?:\r\n|\r|\n)/g, '</br>')}}></div>

                    {/* Détail du devis par zone ou lot */}
                    <h1 className="text-center pt-5">Détail du devis</h1>
                    {/* Bouton permettant de switcher */}
                    <div className="text-center  mx-auto my-3">
                        <button className="btn btn-success" onClick={this.handleClick}>
                            {isToggleOn ? 'Vue par lot' : 'Vue par zone'}
                        </button>
                    </div>
                    {/* Si bouton : affichage Lot, si bouton toggle : affichage zone */}
                    {/* Amélioration possible : accordéon pour les zones/lots et icones pour les zones cuisine sur le coté pour naviguer facilement*/}
                    {isToggleOn 
                    ? 
                        (devis.sections[0].lots.map(( lot, index ) => {
                            return (
                                <AffichageDesLots data={lot || {}} key={`lot${index}`} className="py-2"/>
                            );
                        }))
                    : 
                        (this.state.QuoteRooms.map(( zone, index ) => {
                            console.log('zone ', zone)
                            return (
                                <AffichageDesLots data={zone || {}} key={zone.key} className="py-2"/>
                            );
                        }))
                    }
                    {/* Pied de page avec les totaux et les modalités */}
                    <div className="py-3 text-center">
                        <h1 className="">
                            {`Devis Hors Taxes ${devis.prixTotalHT.toFixed(2)} € HT `}
                        <h1 className="">
                        </h1>
                            {`Devis TTC ${devis.prixTotalTTC.toFixed(2)} € TTC`}
                        </h1>
                        <div>
                            <h4><small> {`Ce devis est valable ${devis.dureeValidite} compter du  ${devis.date}`}</small></h4>
                        </div>
                    </div>
                    <div className="py-2 text-center">
                        <h1 className="">
                            Modalité de paiement
                        </h1>
                        <div className="row">
                            {(devis.modalitesPaiement.map(( modalite, index ) => {
                                return (
                                    <div className="col" key={`${modalite.pourcentage}`}>
                                        <div>{`${modalite.label}`}</div>
                                        <div>{`${modalite.pourcentage} % soit ${modalite.montant} €`}</div>
                                    </div>
                                );
                            }))}
                        </div>
                    </div>
                    {/* Signature pour validation du devis par le client */}
                    <div className="my-5 text-center">
                        <div className="row">
                            <div className="col">
                                Signature de la société
                            </div>
                            <div className="col">
                                <div>Date Signature du client</div>
                                <small>précédée de la mention 'Bon pour accord'</small>

                            </div>
                        </div>
                    </div>
                </div>
		    );
        };
    }
}
export default Devis;
