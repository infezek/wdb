import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { database } from './databases';
import { User as ModelUser } from './databases/model/User'

import UserJson from './users.json'


const App: React.FC = () => {
    const [info, setInfo] = useState("")
    const [process, setProcess] = useState("")
    const [qnt, setQNT] = useState(0)
    const [json, setJson] = useState(0)


    async function HomeGetItens() {
        console.log("Json: ", UserJson.length)
        setJson(UserJson.length)
    }


    useEffect(() => {
        HomeGetItens()
    }, [])

    async function HomeGet() {
        const userCollection = database.get<ModelUser>('users');
        const users = await userCollection.query().fetch();
        console.log("Get: ", users.length);
        setQNT(users.length)

    }

    async function HomeDelete() {
        setProcess("Iniciado D.");
        setInfo("Deletando")
        await database.write(async () => {
            await database.collections.get('users').query().destroyAllPermanently()
        });
        setInfo("")

        const userCollection = database.get<ModelUser>('users');
        const users = await userCollection.query().fetch();
        setQNT(users.length)
    }

    async function HomeSave() {
        console.log("Iniciado s.");
        setProcess("Iniciado S.");
        const userCollection = database.get<ModelUser>('users');
        await database.write(async () => {
            console.log("Saving...");
            setInfo("Saving...");
            UserJson.forEach(async (user) => {
                await userCollection.create((newUser) => {
                    newUser.user_id = user.user_id;
                    newUser.name = user.name;
                })
            })
            setInfo("");
        })
        setProcess("Saved.");
        const users = await userCollection.query().fetch();
        setQNT(users.length)
    }


    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            }}>

            <Text style={{ fontSize: 22 }}>{`Json: ${json}`}</Text>
            <Text style={{ fontSize: 22 }}>{`Itens no banco: ${qnt}`}</Text>
            <Text style={{ fontSize: 22 }}>{process}</Text>
            <Text style={{ fontSize: 22 }}>{info}</Text>

            <TouchableOpacity onPress={HomeGetItens}>
                <Text style={{ marginTop: 20, borderRadius: 10, padding: 30, backgroundColor: "#6f6" }}>
                    Json Len
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={HomeDelete}>
                <Text style={{ marginTop: 20, borderRadius: 10, padding: 30, backgroundColor: "#f00" }}>
                    Delete
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={HomeGet}>
                <Text style={{ marginTop: 20, borderRadius: 10, padding: 30, backgroundColor: "#f8f" }}>
                    Get
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={HomeSave}>
                <Text style={{ marginTop: 20, borderRadius: 10, padding: 30, backgroundColor: "#68f" }}>
                    Salvar
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default App;