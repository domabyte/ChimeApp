import { useContext, useEffect, useState } from 'react';
import {
  ImageBackground,
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import config from '../../config/config';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';

const Information = ({ navigation, route }) => {
  const { userInfo } = route.params;
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([{ label: 'Select a state', value: null }]);
  const [countryValue, setCountryValue] = useState(null);
  const [stateValue, setStateValue] = useState(null);
  const [countryName, setCountryName] = useState(null);
  const [stateName, setStateName] = useState(null);
  const [postalCode, setPostalCode] = useState(null);
  const [location, setLocation] = useState('');
  const { isLoading, basicInfo, error, setError } = useContext(AuthContext);

  const fetchCountryDetails = async () => {
    const { data } = await axios.get(config.countryListURL);
    if (data) {
      const countries = data.map(response => ({
        label: response?.CountryName,
        value: response?.ID,
      }));
      setCountry(countries);
    }
  };

  useEffect(() => {
    if (countryValue) {
      const fetchStateDetails = async () => {
        const { data } = await axios.get(config.stateListURL + countryValue);
        if (data) {
          const states = data.map(state => ({
            label: state?.StateOrProvinceName,
            value: state?.ID,
          }));
          setState(states);
        }
      };
      fetchStateDetails();
    }
  }, [countryValue]);

  useEffect(() => {
    setError('');
    fetchCountryDetails();
    return () => {
      setError('');
    };
  }, []);

  const renderItem = item => {
    if (item) {
      return (
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.label}</Text>
        </View>
      );
    }
  };

  const validateInputs = () => {
    let valid = true;
    switch (true) {
      case !countryValue:
        setError('Please select a country');
        valid = false;
        break;
      case !stateValue:
        setError('Please select a state');
        valid = false;
        break;
      case !postalCode:
        setError('Please enter a postal code');
        valid = false;
        break;
      case !location:
        setError('Please enter a location');
        valid = false;
        break;
      default:
        break;
    }
    return valid;
  };

  const handleContinue = async () => {
    if (validateInputs()) {
      if (isNaN(postalCode)) {
        setError('Postal code should be numeric');
        return;
      } else {
        const response = await basicInfo(location, countryValue, userInfo.id, stateValue, postalCode, userInfo.name);
        const encryptToken = userInfo.encryptToken;
        const loginToken = userInfo.LoginToken;
        const memberToken = userInfo.memberToken;
        if (response) {
          navigation.navigate('addProfile', { response, countryName, stateName, encryptToken, loginToken, memberToken });
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <ScrollView>
        <>
          <View style={[styles.center, { marginTop: responsiveWidth(30) }]}>
            <Spinner visible={isLoading} />
            <Text style={{ color: '#1866B4', fontWeight: '500', fontSize: responsiveFontSize(1.8) }}>Step 1 of 2</Text>
            <Text
              style={{
                fontSize: responsiveFontSize(3),
                color: 'black',
                fontWeight: '500',
                marginTop: responsiveWidth(2)
              }}>
              Personal Information
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(1.8),
                width: responsiveWidth(74),
                color: 'black',
                marginHorizontal: 20,
                textAlign: 'center',
                marginTop: 12,
              }}>
              Let’s start your profile, connect to people you know, and engage with them on topics you care about
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              marginHorizontal: responsiveWidth(4)
            }}>
            <View style={{ marginTop: responsiveWidth(5), position: 'relative' }}>
              <Text style={styles.Label}>Address <Text style={{ color: '#1866B4' }}>*</Text></Text>
              <TextInput
                placeholder="Enter your address."
                style={styles.inputBox}
                required
                value={location}
                onChangeText={text => setLocation(text)}
              />
            </View>
            <View style={{ marginTop: responsiveWidth(3), position: 'relative' }}>
              <Text style={styles.Label}>Select Country <Text style={{ color: '#1866B4' }}>*</Text></Text>
              <Dropdown
                style={[styles.inputBox, { paddingRight: responsiveWidth(4) }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                containerStyle={styles.dropBackground}
                data={country}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Country*"
                value={countryValue}
                onChange={item => {
                  setCountryValue(item.value);
                  setCountryName(item.label);
                }}
                renderLeftIcon={() => (
                  <Image
                    style={styles.icon}
                    source={require('../../assets/png/Arrow.png')}
                  />
                )}
                renderItem={renderItem}
              />
            </View>
            <View style={{ marginTop: responsiveWidth(3), position: 'relative' }}>
              <Text style={styles.Label}>State <Text style={{ color: '#1866B4' }}>*</Text></Text>
              <Dropdown
                style={[styles.inputBox, { paddingRight: responsiveWidth(4) }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                containerStyle={styles.dropBackground}
                data={state}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="State*"
                value={stateValue}
                onChange={item => {
                  setStateValue(item.value);
                  setStateName(item.label);
                }}
                renderLeftIcon={() => (
                  <Image
                    style={styles.icon}
                    source={require('../../assets/png/Arrow.png')}
                  />
                )}
                renderItem={renderItem}
              />
            </View>
            <View style={{ marginTop: responsiveWidth(3), position: 'relative' }}>
              <Text style={styles.Label}>Zip Code <Text style={{ color: '#1866B4' }}>*</Text></Text>
              <TextInput
                placeholder="Enter Code"
                style={styles.inputBox}
                keyboardType="numeric"
                required
                value={postalCode}
                onChangeText={text => setPostalCode(text)}
              />

            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        </>
        <View style={{ marginHorizontal: responsiveWidth(4), marginBottom: responsiveWidth(4) }}>
          <TouchableOpacity onPress={handleContinue} style={{ alignSelf: 'stretch', }}>
            <LinearGradient style={styles.blueBtn} colors={['#3B7DBF', '#1866B4']}>
              <Text style={{ color: '#fff', fontWeight: '500', fontSize: 18 }}>
                Continue
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Information;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  center: {
    alignItems: 'center',
    display: 'flex',
  },
  icon: {
    width: 20,
    height: 20,
    position: 'absolute',
    right: 0,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  placeholderStyle: {
    fontSize: responsiveFontSize(2),
    color: 'black',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  iconStyle: {
    display: 'none',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 6,
    color: 'black',
    borderColor: '#CED4DA',
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  dropBackground: {
    borderRadius: 10,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 14,
    paddingLeft: responsiveWidth(5),
    height: responsiveWidth(12),
    fontSize: responsiveFontSize(2),
  },
  blueBtn: {
    backgroundColor: '#1866B4',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(4),
    marginTop: responsiveWidth(8),
    padding: responsiveWidth(3),
  },
  Label: {
    fontSize: responsiveFontSize(2),
    color: 'black',
    marginLeft: responsiveWidth(1),
    marginBottom: responsiveWidth(1.5)
  },
});
