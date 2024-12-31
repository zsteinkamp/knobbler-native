import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleProp, Text, TextStyle, TouchableOpacity, View } from "react-native";

import Zeroconf from "react-native-zeroconf";
import { TEXT_COMMON } from "../lib/constants";

import { NetworkInfo } from 'react-native-network-info'
import { useAppContext } from "../AppContext";

const zeroconf = new Zeroconf()

export default function AutoDiscovery() {
  const [isScanning, setIsScanning] = useState(false)
  const [services, setServices] = useState({})
  const [selectedService, setSelectedService] = useState(null)
  const { setServerHost, setServerPort } = useAppContext()
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
    }, 5000)
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

  const styles = {
    container: {
      flex: 1,
      marginLeft: 10
    },
    closeButton: {
      padding: 20,
      textAlign: 'center',
    } as StyleProp<TextStyle>,
    json: {
      padding: 10,
    },
    state: {
    } as StyleProp<TextStyle>,
  }

  const chooseService = (host: string) => {
    setSelectedService(host)
    setServerHost(services[host]?.host)
    setServerPort(services[host]?.port)
  }

  if (service) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => chooseService(null)}>
          <Text style={[TEXT_COMMON, styles.closeButton]}>{'RESET'}</Text>
        </TouchableOpacity>

        <Text style={[TEXT_COMMON, styles.json]}>{JSON.stringify(service, null, 2)}</Text>
      </View>
    )
  }

  const renderServiceItem = ({ name }) => {
    return (
      <Text style={TEXT_COMMON}>{name}</Text>
    )
  }

  const renderRow = ({ item, index }) => {
    return (
      <TouchableOpacity key={index} onPress={() => chooseService(item.host)}>
        {renderServiceItem(item)}
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={[TEXT_COMMON, styles.state]}>{isScanning ? 'Scanning...' : 'Stopped'}</Text>

      <FlatList
        style={{ height: 100 }}
        data={Object.values(services)}
        renderItem={renderRow}
        refreshControl={
          <RefreshControl
            refreshing={isScanning}
            onRefresh={refreshData}
            tintColor="skyblue"
          />
        }
      />
    </View>
  )
}