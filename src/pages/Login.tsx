import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button'; // RUTA CORREGIDA
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'; // RUTA CORREGIDA
import { Mail, Loader2, LogIn } from 'lucide-react';

export const Login: React.FC = () => {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const handleGoogleLogin = async () => {
    try {
      // Nota: asumiendo que loginWithGoogle maneja la autenticación y la configuración inicial del usuario
      await loginWithGoogle(); 
      navigate('/dashboard');
      showToast({ title: 'Bienvenido/a', description: 'Has iniciado sesión con éxito.', variant: 'success' });
    } catch (e) {
      console.error("Login failed:", e);
      showToast({ title: 'Error de Acceso', description: 'No se pudo iniciar sesión. Inténtalo de nuevo.', variant: 'error' });
    }
  };

  // Si el usuario ya está autenticado (no anónimo), redirigir
  if (user && !user.isAnonymous) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Acceso a AgroApp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-sm text-gray-500">
            Ingresa para gestionar tus operaciones de cereales.
          </p>
          <Button 
            onClick={handleGoogleLogin} 
            className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white" 
            icon={<LogIn size={20}/>}
          >
            Ingresar con Google
          </Button>

          {/* Opcional: Login Anónimo (para entornos de prueba) */}
          <p className="text-xs text-center text-gray-400 mt-4">
            <span onClick={() => { /* Lógica de login anónimo si fuera necesario */ }} className="cursor-pointer hover:underline">
              Solo para demostración
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};