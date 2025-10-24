import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PlusCircle, Edit, Trash2, User, Building, Truck } from 'lucide-react';
import { useContacts } from '@/context/ContactsContext';
import { Contact, ContactType } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { useToast } from '@/context/ToastContext';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { v4 as uuidv4 } from 'uuid'; // 🔧 Corrige el import de UUID

// Icono según el tipo de contacto
const ContactIcon: React.FC<{ type: ContactType[] }> = ({ type }) => {
  if (type.includes('Productor')) return <User className="text-blue-500" />;
  if (type.includes('Comprador')) return <Building className="text-green-500" />;
  if (type.includes('Transportista')) return <Truck className="text-orange-500" />;
  return <User className="text-gray-500" />;
};

// Modelo base para contacto vacío
const emptyContact: Omit<Contact, 'id'> = {
  name: '',
  cuit: '',
  phone: '',
  email: '',
  type: [],
};

export const Contacts: React.FC = () => {
  const { contacts, addContact, updateContact, deleteContact } = useContacts();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | Omit<Contact, 'id'> | null>(null);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const openModal = (contact?: Contact) => {
    setEditingContact(contact || emptyContact);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  const closeConfirmModal = () => {
    setIsConfirmOpen(false);
    setContactToDelete(null);
  };

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!contactToDelete) return;
    try {
      await deleteContact(contactToDelete.id);
      showToast({
        title: 'Contacto Eliminado',
        description: `Se eliminó a ${contactToDelete.name}.`,
        variant: 'success',
      });
      closeConfirmModal();
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'No se pudo eliminar el contacto.',
        variant: 'error',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingContact) return;
    const { name, value } = e.target;
    setEditingContact(prev => ({ ...prev!, [name]: value }));
  };

  const handleTypeChange = (type: ContactType) => {
    if (!editingContact) return;
    setEditingContact(prev => {
      if (!prev) return null;
      const currentTypes = prev.type;
      const newTypes = currentTypes.includes(type)
        ? currentTypes.filter(t => t !== type)
        : [...currentTypes, type];
      return { ...prev, type: newTypes };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact || editingContact.type.length === 0) {
      showToast({
        title: 'Error',
        description: 'Debe seleccionar al menos un tipo de contacto.',
        variant: 'error',
      });
      return;
    }

    try {
      if ('id' in editingContact) {
        await updateContact(editingContact as Contact);
        showToast({
          title: 'Actualizado',
          description: `Se actualizó el contacto ${editingContact.name}.`,
          variant: 'success',
        });
      } else {
        const newContact: Contact = { ...editingContact, id: uuidv4() } as Contact;
        await addContact(newContact);
        showToast({
          title: 'Creado',
          description: `Se creó el contacto ${newContact.name}.`,
          variant: 'success',
        });
      }
      closeModal();
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'Hubo un error al guardar el contacto.',
        variant: 'error',
      });
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Contactos</h1>
        <Button
          onClick={() => openModal()}
          icon={<PlusCircle />}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Nuevo Contacto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Contactos ({contacts.length})</CardTitle>
        </CardHeader>
        <div className="divide-y divide-gray-200">
          {contacts.length > 0 ? (
            contacts.map(contact => (
              <div
                key={contact.id}
                className="p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-6 h-6">
                    <ContactIcon type={contact.type} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{contact.name}</p>
                    <p className="text-sm text-gray-500">
                      {contact.email} | {contact.cuit}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openModal(contact)}
                    icon={<Edit size={16} />}
                    title="Editar"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(contact)}
                    icon={<Trash2 size={16} className="text-red-500" />}
                    title="Eliminar"
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="p-4 text-gray-600">No hay contactos registrados.</p>
          )}
        </div>
      </Card>

      {/* Modal Crear/Editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          editingContact && 'id' in editingContact
            ? 'Editar Contacto'
            : 'Nuevo Contacto'
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <Input
            label="Nombre/Razón Social *"
            name="name"
            value={editingContact?.name || ''}
            onChange={handleChange}
            required
          />
          <Input
            label="CUIT/CUIL"
            name="cuit"
            value={editingContact?.cuit || ''}
            onChange={handleChange}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={editingContact?.email || ''}
            onChange={handleChange}
          />
          <Input
            label="Teléfono"
            name="phone"
            value={editingContact?.phone || ''}
            onChange={handleChange}
          />
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Contacto
            </p>
            <div className="flex gap-4">
              <Checkbox
                label="Productor"
                checked={editingContact?.type.includes('Productor') || false}
                onChange={() => handleTypeChange('Productor')}
              />
              <Checkbox
                label="Comprador"
                checked={editingContact?.type.includes('Comprador') || false}
                onChange={() => handleTypeChange('Comprador')}
              />
              <Checkbox
                label="Transportista"
                checked={editingContact?.type.includes('Transportista') || false}
                onChange={() => handleTypeChange('Transportista')}
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 gap-2">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>

      {contactToDelete && (
        <ConfirmationModal
          isOpen={isConfirmOpen}
          onClose={closeConfirmModal}
          onConfirm={handleDelete}
          title="Confirmar Eliminación"
          message={`¿Está seguro que desea eliminar a ${contactToDelete.name}? Esta acción no se puede deshacer.`}
          confirmText="Sí, Eliminar"
        />
      )}
    </div>
  );
};
