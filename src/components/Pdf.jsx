import React from 'react'
import { Document, Page, View, Text } from "@react-pdf/renderer"

const Pdf = ({rho,ls,lq,ws,wq}) => {
  return (
    <Document>
        <Page size="A4">
            <View>
                <Text>Resultados del ejercicio</Text>
                <Text>
                    <Text>{rho}</Text>
                    <Text>{ls}</Text>
                    <Text>{lq}</Text>
                    <Text>{ws}</Text>
                    <Text>{wq}</Text>
                </Text>
            </View>
        </Page>
    </Document>
  )
}

export default Pdf