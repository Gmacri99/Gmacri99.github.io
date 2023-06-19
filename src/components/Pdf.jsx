import React from 'react'
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer"


const styles = StyleSheet.create({
  title:{
    textAlign:"center",
    paddingVertical:5,
    fontWeight:"bold"
  },
  resultados:{
    textAlign:"center",
    paddingVertical:3,
    backgroundColor: '#C4E4D4',
    border:1,
    fontSize:"16px",
    borderTop:0,
    borderColor:"black"
  },
  resultadosAcumulado:{
    paddingVertical:2,
    flex:2,
    flexDirection:"column",
    backgroundColor: '#C4E4D4'
  },
  page: {
    display:"grid",
    justifyContent:"space-around",
    textAlign:"center",
    paddingVertical:4,
    width:"100%",
    backgroundColor: '#E4E4E4',
    border:1,
    borderColor:"black"
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

const Pdf = ({miu,limit,lambda,C,rho,ls,lq,ws,wq,λef,acumulado}) => {
  return (
    <Document>
        <Page size="A4">
            <View>
                <Text style={styles.title}>Resultados del ejercicio</Text>
                  <View style={styles.page}>
                    <Text>Lambda: {lambda} <br/> Miu: {miu} <br/> Limite de cola: {limit} <br/> Servidores: {C}</Text>
                  </View>
                  <View style={styles.resultados}>
                    <Text>Rho {rho} <br/> Ls {ls} <br/> Lq {lq} <br/>Ws {ws} <br/> Wq {wq} <br/> {λef}</Text>
                  </View>
                  <View style={{padding:5}}>
                    <Text style={{textAlign:"center", paddingVertical:3}}>Acumulado:</Text>
                    <View style={{display:"flex", flexDirection:"column", border:2, borderColor:"black"}}>{acumulado?.map((el)=><View style={{backgroundColor: '#C4E4D4', paddingVertical:7, display:"flex", borderBottom:1,textAlign:"center", width:"100%"}}><Text>N: {el.n}   Pn: {el.Pn.toFixed(4)}    Acumulado: {el.PnAccumulated.toFixed(4)}</Text></View>)}</View>
                  </View>
            </View>
        </Page>
    </Document>
  )
}

export default Pdf