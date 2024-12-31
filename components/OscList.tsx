import React from "react"
import { Button, FlatList, Text, View } from "react-native"
import { TEXT_COMMON } from "../lib/constants"

export default function OscList({ containerStyle, title, data, setData }) {
  const renderListItem = ({ item }) => {
    return <Text style={TEXT_COMMON}>{item}</Text>
  }

  return (
    <View style={[containerStyle, {}]}>
      <View style={{ flexDirection: "row" }}>
        <Text style={[TEXT_COMMON, { fontSize: 24, fontWeight: "bold" }]}>
          {title}
        </Text>
        <Button title="Clear" onPress={() => { setData([]) }} />
      </View>
      <FlatList data={data} renderItem={renderListItem} />
    </View>
  )
}