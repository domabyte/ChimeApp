import {useContext, useEffect, useState} from 'react';
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
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../../context/AuthContext';
import axios from 'axios';
import config from '../../config/config';

const Information = ({navigation, route}) => {
  const {userInfo} = route.params;
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([{label: 'Select a state', value: null}]);
  const [countryValue, setCountryValue] = useState(null);
  const [stateValue, setStateValue] = useState(null);
  const [countryName, setCountryName] = useState(null);
  const [stateName, setStateName] = useState(null);
  const [postalCode, setPostalCode] = useState(null);
  const [location, setLocation] = useState('');
  const {isLoading, basicInfo, error, setError} = useContext(AuthContext);

  const fetchCountryDetails = async () => {
    const {data} = await axios.get(config.countryListURL);
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
        const {data} = await axios.get(config.stateListURL + countryValue);
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
      }else {
       const response = await basicInfo(location, countryValue, userInfo.id, stateValue, postalCode, userInfo.name);
       const encryptToken = userInfo.encryptToken;
       if(response) {
         navigation.navigate('addProfile', {response, countryName, stateName, encryptToken});
       }
      }
    }
  };

  return (
    <>
      <StatusBar barStyle={'dark-lite'} backgroundColor="#1E293C" />
      <ImageBackground
        source={require('../../assets/png/LoginBg.png')}
        style={styles.backgroundImg}>
        <ScrollView>
          <View style={styles.center}>
            <Spinner visible={isLoading} />
            <Text
              style={{
                fontSize: 24,
                color: 'black',
                marginTop: 150,
                fontWeight: '500',
              }}>
              Personal Information
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: 'black',
                marginHorizontal: 20,
                textAlign: 'center',
                marginTop: 12,
              }}>
              Let's start your profile, connect to people you know, and engage
              with them on topics you care about
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginTop: 20,
            }}>
            <Dropdown
              style={styles.dropdown}
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
            <Dropdown
              style={styles.dropdown}
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
            <TextInput
              placeholder="Postal code*"
              style={styles.inputBox}
              keyboardType="numeric"
              required
              value={postalCode}
              onChangeText={text => setPostalCode(text)}
            />
            <TextInput
              placeholder="Location within this area*"
              style={styles.inputBox}
              required
              value={location}
              onChangeText={text => setLocation(text)}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={styles.blueBtn} onPress={handleContinue}>
              <Text style={{color: '#fff', fontWeight: '500', fontSize: 18}}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </>
  );
};

export default Information;

const styles = StyleSheet.create({
  backgroundImg: {
    resizeMode: 'cover',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    display: 'flex',
  },
  dropdown: {
    marginTop: 18,
    height: 50,
    width: '90%',
    borderColor: '#CED4DA',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 20,
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
    fontSize: 16,
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
    borderRadius: 50,
    paddingLeft: 20,
    height: 50,
    fontSize: 16,
    width: '90%',
    marginTop: 18,
  },
  blueBtn: {
    backgroundColor: '#1866B4',
    height: 45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 20,
    width: '90%',
    marginBottom: 20,
  },
});
