import {StyleSheet} from 'react-native';

const CommonStyles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#2f4f4f',
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#2f4f4f',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 50,
  },
  container2: {
    flex: 1,
    backgroundColor: '#2f4f4f',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 50,
  },
  flexContainer: {
    flex: 1,
    backgroundColor: '#2f4f4f',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  title2: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  heading: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  spacer: {
    height: 20,
  },
  spacerLarge: {
    height: 40,
  },
  inputSection: {
    width: '80%',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  inputContainerCenter: {
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
  },
  dropdownView: {
    height: 100,
  },
  label: {
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    height: 50,
    width: '100%',
    fontSize: 16,
    padding: 10,
    marginBottom: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  checkboxLabel: {
    marginLeft: 8,
    color: '#fff',
  },
  forgotPassword: {
    color: '#fff',
    marginLeft: 10,
    textDecorationLine: 'none',
  },
  button: {
    height: 47,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#2f4f4f',
    fontSize: 22,
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  linkText: {
    color: '#fff',
    textDecorationLine: 'none',
  },
  linkBoldText: {
    fontWeight: 'bold',
  },
  instruction: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  errorText: {
    color: 'orange',
    fontSize: 12,
    marginTop: 5,
  },
  inputError: {
    borderColor: 'orange',
    borderWidth: 2,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 5,
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#2f4f4f',
  },
  bigLogo: {
    width: 150,
    height: 180,
    resizeMode: 'contain',
  },
  smallText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
});

export default CommonStyles;
