import { ScrollView } from 'react-native';
import LoginForm from '../../../src/components/forms/LoginForm';

const Login = () => {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <LoginForm containerClassName="mt-8" />
    </ScrollView>
  );
};

export default Login;