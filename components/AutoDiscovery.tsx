import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, Pressable, View } from "react-native";

import Zeroconf from "react-native-zeroconf";
import { TEXT_COMMON } from "../lib/constants";

import { NetworkInfo } from 'react-native-network-info'
import { useAppContext } from "../AppContext";
import { DarkTheme } from "@react-navigation/native";

const zeroconf = new Zeroconf()

export default function AutoDiscovery() {
  const [isScanning, setIsScanning] = useState(false)
  const [services, setServices] = useState({})
  const [selectedService, setSelectedService] = useState(null)
  const { serverHost, setServerHost, serverPort, setServerPort } = useAppContext()
  let timeout = null

  const refreshData = () => {
    if (isScanning) {
      return
    }

    setServices({})

    zeroconf.scan('osc', 'udp', 'local.')

    clearTimeout(timeout)
    timeout = setTimeout(() => {
      zeroconf.stop()
    }, 500)
  }

  useEffect(() => {
    //console.log("USEEFFECT ZERO")
    refreshData()

    NetworkInfo.getIPV4Address().then((ip) => {
      //console.log('IP ' + ip)
      zeroconf.publishService('osc', 'udp', 'local.', "Knobbler UI (" + ip + ")", 2347)
    })

    zeroconf.on('start', () => {
      setIsScanning(true)
      //console.log('[Start]')
    })

    zeroconf.on('stop', () => {
      setIsScanning(false)
      //console.log('[Stop]')
    })

    zeroconf.on('resolved', service => {
      if (!service.name.match(/Knobbler/) || service.name.match(/Knobbler UI/)) {
        return
      }

      //console.log('[Resolve]', JSON.stringify(service, null, 2))

      setServices({
        ...services,
        [service.host]: service,
      })
    })

    zeroconf.on('error', err => {
      setIsScanning(false)
      //console.log('[Error]', err)
    })
    return () => {
      zeroconf.removeDeviceListeners()
    }
  }, [])

  const service = selectedService ? services[selectedService] : null;
  //console.log('SERVICE', service)

  const chooseService = (host: string) => {
    //console.log('Choose', host)
    setSelectedService(host)
    setServerHost(services[host]?.host)
    setServerPort(services[host]?.port)
  }

  const renderRow = ({ item, index }) => {
    const baseColor = "#3399CC"
    const selectedColor = "#FFCC33"
    const color = (item.host === serverHost && item.port === serverPort) ? selectedColor : baseColor

    return (
      <Pressable key={index} onPress={() => chooseService(item.host)}>
        <View style={{ backgroundColor: color + "44", padding: 20, marginTop: 20, borderRadius: 10 }}>
          <Text style={{ color: color }}>{item.name}</Text>
        </View>
      </Pressable>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={[TEXT_COMMON, { fontSize: 18, fontWeight: "bold" }]}>
        Found These Knobblers
      </Text>
      <Text style={[TEXT_COMMON, { marginTop: 10, opacity: 0.5 }]}>
        Pull Down to Refresh
      </Text>
      <FlatList
        style={{}}
        data={Object.values(services)}
        renderItem={renderRow}
        refreshControl={<RefreshControl
          refreshing={isScanning}
          onRefresh={refreshData}
          tintColor={DarkTheme.colors.text} />} />

    </View>
  )
}