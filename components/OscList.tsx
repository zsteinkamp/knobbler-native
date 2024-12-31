import React from "react"
import { Button, FlatList, Text, View } from "react-native"
import { TEXT_COMMON, TEXT_HEADER } from "../lib/constants"

export default function OscList({ containerStyle = {}, title, data, setData }) {
  const renderListItem = ({ item }) => {
    return <Text style={TEXT_COMMON}>{item}</Text>
  }

  return (
    <View style={[containerStyle, { flexGrow: 1, flexShrink: 1 }]}>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flexGrow: 1 }}>
          <Text style={[TEXT_HEADER]}>
            {title}
          </Text>
        </View>
        <View style={{ flexGrow: 0 }}>
          <Button title="Clear" onPress={() => { setData([]) }} />
        </View>
      </View>
      <FlatList data={data} renderItem={renderListItem} />
    </View>
  )
}