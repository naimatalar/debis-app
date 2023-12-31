import { Image, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { fileurl } from "../crud/crud";
// import LangApp from "../Language";

function InvoiceFlat({ item, prp,detailItem,setDetailItem,setDetailShow }) {
    
    if(!item){return<></>}
    var fppName = "";
    if (item?.companyName != null) {
        fppName = item?.companyName 
    }
    if (item?.personName != " ") {
        fppName = item?.personName
    }
    if (item?.productName != null) {
        fppName = item?.productName
    }
    //   var dimgN = item.documnetKind;
    //  console.log(dimgN)
    return (

        <View key={item.id} style={{ minHeight: 65, margin:15,
             marginBottom: 10, backgroundColor: "white", borderTopWidth: 1, borderBottomWidth: 1,
             borderColor: "#d8672b", borderWidth: 1,flexDirection:"row" }}>
          
            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 3, padding: 1 }}>
                <Text style={{ textAlign: "center" }}>{item.customerTitle}</Text>
                <Text style={{ textAlign: "center",fontWeight:"bold" ,fontSize:11,marginTop:2}}>({item.amount} Tl)</Text>
 
            </View>


            <TouchableOpacity onPress={() => { setDetailItem(item);setDetailShow(true);}} style={{ flexDirection: "row", justifyContent: "center", flex: 2, alignItems: "center", backgroundColor: "#d8672b" }}>

                <MaterialCommunityIcons
                    name="magnify"
                    size={20}
                    color="white"
                    style={{ textAlign: 'right' }}
                />
                <Text style={{ color: "white", fontWeight: "bold" }}>Detay</Text>
            </TouchableOpacity>

        </View>)
}
 
export default InvoiceFlat;