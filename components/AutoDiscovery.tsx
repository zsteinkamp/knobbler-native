import React, { useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, Text, Pressable, View } from "react-native";

import Zeroconf from "react-native-zeroconf";
import { ACCENT1_COLOR, ACCENT2_COLOR, TEXT_COMMON } from "../lib/constants";

import { NetworkInfo } from 'react-native-network-info'
import { useAppContext } from "../AppContext";
import { DarkTheme } from "@react-navigation/native";

const zeroconf = new Zeroconf()

export default function AutoDiscovery() {
  const [isScanning, setIsScanning] = useState(false)
  const [services, setServices] = useState({})
  const servicesRef = useRef(services)
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
    }, 1000)
  }

  const makeServiceKey = ({ host, port }) => {
    return host + ":" + port
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
      //console.log('[Resolve]', makeServiceKey(service), JSON.stringify(service, null, 2))
      const serviceKey = makeServiceKey(service)
      servicesRef.current[serviceKey] = service
      setServices({
        ...services,
        [makeServiceKey(service)]: service,
      })
    })
    zeroconf.on('error', err => {
      setIsScanning(false)
      console.error('[Error]', err)
    })
    return () => {
      zeroconf.removeAllListeners()
    }
  }, [])

  const service = selectedService ? services[selectedService] : null;
  //console.log('SERVICE', service)

  const chooseService = (host: string, port: number) => {
    const hashKey = makeServiceKey({ host, port })
    //console.log('Choose', host)
    setSelectedService(hashKey)
    setServerHost(services[hashKey]?.host)
    setServerPort(services[hashKey]?.port)
  }

  const renderRow = ({ item, index }) => {
    if (item.lastRow) {
      return (
        <Text style={[TEXT_COMMON, { margin: 20, opacity: 0.5 }]}>
          Pull Down to Refresh
        </Text>
      )
    }
    const color = (item.host === serverHost && item.port === serverPort) ? ACCENT1_COLOR : ACCENT2_COLOR

    return (
      <Pressable key={index} onPress={() => chooseService(item.host, item.port)}>
        <View style={{ backgroundColor: color + "44", padding: 20, marginTop: 20, borderRadius: 10 }}>
          <Text style={{ color: color }}>{item.name}</Text>
        </View>
      </Pressable>
    )
  }

  const renderData = [...Object.values(services)]
  renderData.push({
    lastRow: true
  })

  return (
    <View style={{ flex: 1 }}>
      <Text style={[TEXT_COMMON, { fontSize: 18, fontWeight: "bold" }]}>
        Found These Knobblers
      </Text>
      <FlatList
        style={{}}
        data={renderData}
        renderItem={renderRow}
        refreshControl={<RefreshControl
          refreshing={isScanning}
          onRefresh={refreshData}
          tintColor={DarkTheme.colors.text} />} />

    </View>
  )
}