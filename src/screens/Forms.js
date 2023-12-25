import React, { useEffect } from 'react';
import { Alert, Button, FlatList, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { apiConstant } from '../apiCrud/apiConstant';
import { GetAxios, PostAxios } from '../apiCrud/crud';
import InvoiceFlat from '../components/InfoiceFlat';
import Loading from '../components/loading';
import { Dialog } from 'react-native-paper';
import FromFlat from '../components/FromFlat';
import { Picker } from '@react-native-picker/picker';
import SearchableDropDown from 'react-native-searchable-dropdown';
import { useState } from 'react';
import { Switch } from 'react-native-gesture-handler';
import { FloatingLabelInput } from 'react-native-floating-label-input';
function FormsScreen(props) {
    const [pageNumber, setPageNumber] = useState(1);
    const [listData, setListData] = useState([]);
    const [transData, setTransData] = useState(false);
    const [totalData, setTotalData] = useState(0);
    const [dataLoading, setDataLoading] = useState(false);
    const [isPageLoadData, setIsPagaLoadData] = useState(true);
    const [detailShow, setDetailShow] = useState(false);
    const [detailItem, setDetailItem] = useState({});
    const [companyType, setCompanyType] = useState([]);
    const [formCreateModel, setFromCreateModel] = useState({});


    const [multyCompanyType, setMultyCompanyType] = useState([]);
    const [isMultiCompanyType, setIsMultyCompanyType] = useState(false);

    const [selectedMultiType, setSelectedMultiType] = useState([]);
    const [customerOption, setCustomerOption] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState();
    const [allCustomerData, setAllCustomerData] = useState([]);
    const [projectName, setProjectNAme] = useState();
    const [groupModal, setGroupModal] = useState(false);
    const [selectedTopicId, setSelectedTopicId] = useState(false);


    useEffect(() => { getAllData() }, [])
    const create = async () => {
        var cprop = await PostAxios(apiConstant.BaseUrl + "/api/Company/Create", formCreateModel).then(x => { return x.data }).catch(x => { return x });

        getAllData();
    }
    const getCustomerByName = async (name) => {

        if (name.length < 2) {
            return []
        }
        var d = await PostAxios(apiConstant.BaseUrl + "/api/debisCompany/GetActiveCustomersByName",
            { key: name }).then(x => { return x.data }).catch(x => { return x });

        setAllCustomerData(d.data)
        setCustomerOption(d.data.map((item, key) => { return { value: item.name, name: item.name } }))


    }

    const saveMultiForm = async () => {

        if (selectedCustomer && selectedMultiType.length > 0) {
            var ddata = { selectedCustomer, selectedMultiType, projectName: projectName || "" }


            var d = await PostAxios(apiConstant.BaseUrl + "/api/Company/CreateMulti", ddata).then(x => { return x.data }).catch(x => { return x });

            if (d.isError) {
                alert(d.message)
            } else {

                alert("Kayıt Başarılı")

            }


        }

    }
    const deleteData = async (id) => {
        Alert.alert('Sil', 'Kayıt silinecek onaylıyor musunuz?', [
            {
                text: 'Sil', onPress: async () => {
                    var cprop = await GetAxios(apiConstant.BaseUrl + "/api/Company/Delete/" + id).then(x => { return x.data }).catch(x => { return x });
                    getAllData();
                }
            },
            {
                text: 'Vazgeç',
                onPress: () => { },
                style: 'cancel',
            }

        ]);



    }
    const setMultiDataFunc = async (id, val) => {

        var selectedValues = selectedMultiType.filter(x => { return x.id != id })
        selectedValues.push({ id: id, count: val })
        setSelectedMultiType(selectedValues)
    }
    const getAllData = async (first = true) => {
        if (first === true) {
            //  setPageNumber(1)
            setListData([])
        }
        setTransData(true)
        setDataLoading(true)

        var cprop = await GetAxios(apiConstant.BaseUrl + "/api/Company/GetCompanyType").then(x => { return x.data }).catch(x => { return x });
        setCompanyType(cprop.data)

        var ctype = await GetAxios(apiConstant.BaseUrl + "/api/companytype/GetMultiCompanyType").then(x => { return x.data }).catch(x => { return x });
        setMultyCompanyType(ctype.data)

        var d = []
        if (isPageLoadData == false) {
            d = await PostAxios(apiConstant.BaseUrl + "/api/Company/GetByCurrentUserPager", {
                "pageNumber": first == true ? 1 : pageNumber + 1,
                "pageSize": 10,

            }).then(x => { return x.data }).catch(x => { return x });
        } else {

            d = await PostAxios(apiConstant.BaseUrl + "/api/Company/GetByCurrentUserPager", {
                pageNumber: first == true ? 1 : pageNumber + 1,
                pageSize: 10,

            }).then(x => { return x.data }).catch(x => { return x });
        }
        var ll = listData;
        setTotalData(d.data.totalCount)


        d.data.list.forEach(element => {
            ll.push(element)
        });
        setTimeout(() => {
            if (first === true) {
                setListData(d.data.list)

            } else {

                setListData(ll)
                var sas = pageNumber + 1
                setPageNumber(sas)

            }
            setTransData(false)
            setDataLoading(false)
        }, 600);





    };


    const scrollBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };
    return (<>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity onPress={() => setDetailShow(true)} style={{ backgroundColor: "#1565C0", padding: 10, marginTop: 10, marginBottom: 10 }}>
                <Text style={{ color: "white" }}>Yeni Form</Text>
            </TouchableOpacity>

        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>


            <FlatList
                data={listData}
                renderItem={({ item }) => <FromFlat deleteData={deleteData} setDetailShow={setDetailShow} setDetailItem={setDetailItem} key={item.id} item={item} prp={props} />}
                horizontal={false}
                keyExtractor={item => item.id}
                ListEmptyComponent={dataLoading && <View style={{ justifyContent: "center", flexDirection: "row" }}><Loading></Loading></View>}

                numColumns={1}
                onScroll={({ nativeEvent }) => {

                    if (scrollBottom(nativeEvent)) {

                        if (transData == false) {

                            if (pageNumber != totalData) {
                                alert("fds")
                                getAllData(false)
                            }
                        }
                    }
                }}
            />




        </View>
        {detailShow && <View style={{ borderRadius: 10, padding: 5, justifyContent: "flex-start", alignItems: "center", position: "absolute", backgroundColor: "white", height: "100%" }}>

            <View >
                <SafeAreaView>
                    <View style={{ maxHeight: 400, width: "100%" }}>
                        <View style={isMultiCompanyType && { backgroundColor: "#C8E6C9" } || { backgroundColor: "#EFEBE9" }}>
                            <View style={{ flexDirection: "row", alignItems: "center", margin: 10 }}>
                                <Text style={{ fontWeight: "bold", marginRight: 10, fontSize: 16 }}>Çoklu Form</Text>
                                <Switch value={isMultiCompanyType} onValueChange={(x) => { ; setIsMultyCompanyType(x) }}></Switch>
                            </View>
                        </View>

                        {!isMultiCompanyType && <>


                            <View style={{ flexDirection: "column", marginTop: 10 }}>
                                <Text style={{ fontWeight: "bold", fontSize: 16 }}> Form Türü </Text>
                                <SearchableDropDown
                                    onItemSelect={(item) => {


                                        setFromCreateModel({ ...formCreateModel, companyTypeId: item.id })

                                    }}


                                    containerStyle={{ padding: 5 }}
                                    selectedItems={companyType.find(x => { return x.id == formCreateModel.companyTypeId })}
                                    itemStyle={{
                                        padding: 10,
                                        marginTop: 2,
                                        backgroundColor: '#ddd',
                                        borderColor: '#bbb',
                                        borderWidth: 1,
                                        borderRadius: 5,
                                    }}

                                    itemTextStyle={{ color: '#222' }}
                                    itemsContainerStyle={{ maxHeight: 140 }}
                                    items={companyType}
                                    resetValue={false}
                                    textInputProps={
                                        {
                                            placeholder: "Form Seç",
                                            underlineColorAndroid: "Form Seç",
                                            style: {
                                                padding: 12,
                                                borderWidth: 1,
                                                borderColor: '#ccc',
                                                borderRadius: 5,
                                            },
                                            onTextChange: text => {
                                                if (text.length >= 2) {

                                                }
                                            }
                                        }
                                    }
                                    listProps={
                                        {
                                            nestedScrollEnabled: false,
                                        }
                                    }
                                />
                            </View>

                            <View style={{ flexDirection: "column", marginTop: 10 }}>
                                <Text style={{ fontWeight: "bold", fontSize: 16 }}> Form Adı </Text>
                                <TextInput
                                    onChangeText={(x) => { setFromCreateModel({ ...formCreateModel, name: x }) }}
                                    style={{
                                        fontSize: 14,
                                        borderStyle: "solid",
                                        borderColor: "grey",
                                        borderWidth: 1,
                                        margin: 5,
                                        padding: 10
                                    }}> </TextInput>
                            </View>
                        </>}
                        {
                            isMultiCompanyType && <View>
                                <SearchableDropDown
                                    onItemSelect={(item) => {

                                        let slc = allCustomerData?.find(x => { return x.name == item.value });

                                        if (slc != undefined) {
                                            setSelectedCustomer(slc)
                                        }
                                    }}
                                    containerStyle={{ padding: 5 }}
                                    itemStyle={{
                                        padding: 10,
                                        marginTop: 2,
                                        backgroundColor: '#ddd',
                                        borderColor: '#bbb',
                                        borderWidth: 1,
                                        borderRadius: 5,
                                    }}
                                    selectedItems={selectedCustomer && { name: selectedCustomer?.name, value: selectedCustomer?.name } || {}}
                                    itemTextStyle={{ color: '#222' }}
                                    itemsContainerStyle={{ maxHeight: 140 }}
                                    items={customerOption}
                                    resetValue={false}
                                    textInputProps={
                                        {
                                            placeholder: "Firma Seç",
                                            underlineColorAndroid: "Firma Seç",
                                            style: {
                                                padding: 12,
                                                borderWidth: 1,
                                                borderColor: '#ccc',
                                                borderRadius: 5,
                                            },
                                            onTextChange: text => {
                                                if (text.length >= 2) {
                                                    getCustomerByName(text);
                                                }
                                            }
                                        }
                                    }
                                    listProps={
                                        {
                                            nestedScrollEnabled: false,
                                        }
                                    }
                                />


                                <SearchableDropDown
                                    onItemSelect={(item) => {
                                        setProjectNAme(item.name)
                                    }}
                                    containerStyle={{ padding: 5 }}
                                    itemStyle={{
                                        padding: 10,
                                        marginTop: 2,
                                        backgroundColor: '#ddd',
                                        borderColor: '#bbb',
                                        borderWidth: 1,
                                        borderRadius: 5,
                                    }}
                                    selectedItems={projectName && { name: projectName, value: projectName } || {}}
                                    itemTextStyle={{ color: '#222' }}
                                    itemsContainerStyle={{ maxHeight: 140 }}
                                    items={[] && selectedCustomer?.customerProjects?.map(x => { return { name: x.name, value: x.name } })}
                                    resetValue={false}
                                    textInputProps={
                                        {
                                            placeholder: "Proje Seç",
                                            underlineColorAndroid: "Proje Seç",
                                            style: {
                                                padding: 12,
                                                borderWidth: 1,
                                                borderColor: '#ccc',
                                                borderRadius: 5,
                                            },
                                            onTextChange: text => {
                                                if (text.length >= 2) {
                                                    getCustomerByName(text);
                                                }
                                            }
                                        }
                                    }
                                    listProps={
                                        {
                                            nestedScrollEnabled: false,
                                        }
                                    }
                                />

                            </View>
                        }
                        {isMultiCompanyType && <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
                            {multyCompanyType.map((item, key) => {
                                var selectedValues = selectedMultiType.find(x => { return x.id == item.id })

                                return <View key={key} style={{ width: "47%", marginBottom: 10 }}>

                                    <View>

                                        <FloatingLabelInput
                                            label={item.name + " Adet"}
                                            value={selectedValues?.count}
                                            isPassword={false}
                                            keyboardType="numeric"
                                            onChangeText={(x) => { setMultiDataFunc(item.id, x) }}
                                            containerStyles={{
                                                borderWidth: 2,
                                                padding: 10,
                                                backgroundColor: '#fff',
                                                borderColor: '#2196F3',
                                                borderRadius: 8,

                                            }}

                                            inputStyles={{ width: 90, height: 21 }}
                                        />
                                    </View>
                                



                                </View>
                            })}
                        </View>}
                    </View>


                    {!isMultiCompanyType && <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-evenly", marginTop: 30, paddingBottom: 5 }}>
                        <TouchableOpacity onPress={() => {
                            if (!formCreateModel.name || !formCreateModel.companyTypeId) {
                                alert("Kayıt Yapılmadı. Gösterilen Alanları Doldurun")
                                return false;
                            }
                            setDetailShow(false); create()
                        }} style={{ backgroundColor: "green", width: 100, justifyContent: "center" }}><Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 16, padding: 8 }}>Kaydet</Text></TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            setDetailShow(false);
                        }} style={{ backgroundColor: "red", width: 100, justifyContent: "center" }}><Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 16, padding: 8 }}>Vazgeç</Text></TouchableOpacity>

                    </View>}
                    {isMultiCompanyType && <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-evenly", marginTop: 30, paddingBottom: 5 }}>
                        <TouchableOpacity onPress={() => {
                            if (!selectedCustomer || !projectName) {
                                alert("Kayıt Yapılmadı. Gösterilen Alanları Doldurun")
                                return false;
                            }
                            setDetailShow(false); saveMultiForm()
                        }} style={{ backgroundColor: "green", width: 100, justifyContent: "center" }}><Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 16, padding: 8 }}>Kaydet</Text></TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            setDetailShow(false);
                        }} style={{ backgroundColor: "red", width: 100, justifyContent: "center" }}><Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 16, padding: 8 }}>Vazgeç</Text></TouchableOpacity>

                    </View>}

                </SafeAreaView>
            </View>
        </View>}
    </>
    );
}

export default FormsScreen;