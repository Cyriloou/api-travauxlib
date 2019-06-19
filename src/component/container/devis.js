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
        this.getDevis('JKusHl8Ba8MABIjdCtLZOe2lxxnUfX');
    }
    
    handleClick() {
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }));
    }

    affichageDevisPieces(devis){
        const { QuoteRooms  } = this.state;
        if (QuoteRooms !== []){
            let newQuoteRooms = {}
            let locations = devis.locations
            let lots = devis.sections[0].lots
            locations.forEach((location) => {
                newQuoteRooms[location.uuid] = {};
                newQuoteRooms[location.uuid].label = location.label; 
                newQuoteRooms[location.uuid].key = location.uuid; 
                newQuoteRooms[location.uuid].surface = location.surface;
                newQuoteRooms[location.uuid].lignes = [];
                newQuoteRooms[location.uuid].prixTotalHT = 0 ;
                newQuoteRooms[location.uuid].prixTotalTTC = 0 ;
            });
            newQuoteRooms.other = {};
            newQuoteRooms.other.label = "Autres prestations"
            newQuoteRooms.other.key = "AutresPrestations";
            newQuoteRooms.other.lignes = [];
            newQuoteRooms.other.prixTotalHT = 0 ;
            newQuoteRooms.other.prixTotalTTC = 0 ;
            lots.forEach((lot) => {
                let lignes = lot.lignes
                lignes.forEach((ligne) => {
                    let locations = ligne.locationsDetails.locations
                    if (locations.length === 0){
                        let newLignes = ligne
                        console.log('ligne ', ligne )
                        delete newLignes.locationsDetails;
                        newQuoteRooms.other.lignes.push(newLignes);
                        newQuoteRooms.other.prixTotalHT += parseInt(ligne.prixHT); 
                        newQuoteRooms.other.prixTotalTTC += parseInt(ligne.prixTTC);
                    }else{
                        locations.forEach((location) => {
                            let newLignes = ligne
                            delete newLignes.locationsDetails
                            newLignes.quantite = location.quantite
                            console.log('newLignes.prixHT ', location.prixUnitaireHT)
                            newLignes.prixHT = ligne.prixUnitaireHT * ligne.quantite
                            newLignes.prixTTC = ligne.prixUnitaireHT * ligne.quantite + ligne.montantTVA
                            newQuoteRooms[location.uuid].lignes.push(newLignes);
                            newQuoteRooms[location.uuid].prixTotalHT += parseInt(ligne.prixHT); 
                            newQuoteRooms[location.uuid].prixTotalTTC += parseInt(ligne.prixTTC);
                        })
                    }
                })
            });
            console.log('newQuoteRooms ', newQuoteRooms);
            let temp = [];
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
		fetch('https://api.travauxlib.com/api/devis-pro/' + key)
			.then(results => results.json())
			.then(results => {
                this.setState({
                    'devis': results,
                    'loading': false
                })
                this.affichageDevisPieces(results)
            });
    }
    


	render(){
        const { devis, loading, isToggleOn } = this.state;
        if(loading) {
            return(<div className="container">Loading</div>)
        }else{
            return (
                <div className="container px-0 mx-auto">
                    <div className="row py-3">
                        <div className="col">
                            <CustomerInfo data={devis.deal || {}}/>
                        </div>
                        <div className="col">
                            <TravauxLibInfo data={devis.company || {}}/>
                        </div>
                    </div>
                    <h1 className="text-center">{devis.title}</h1>
                    <div className="post__content" dangerouslySetInnerHTML={{__html: devis.introductionLetter.replace(/(?:\r\n|\r|\n)/g, '</br>')}}></div>

                    <h1 className="text-center pt-5">Détail du devis</h1>
                    <div className="text-center  mx-auto my-3">
                        <button className="btn btn-success" onClick={this.handleClick}>
                            {isToggleOn ? 'Vue par lot' : 'Vue par zone'}
                        </button>
                    </div>
                    
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
