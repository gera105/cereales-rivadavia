// src/context/ContactsContext.tsx
// -------------------------------------------------------------
// ✅ Contexto de Contactos — Firestore + withConverter
// -------------------------------------------------------------
//
// 🔹 Proporciona funciones para CRUD de contactos
// 🔹 Usa tipado fuerte mediante contactsConverter
// 🔹 Compatible 100 % con Firebase Free Tier
//
// -------------------------------------------------------------

import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { Contact } from "@/types";
import { contactsConverter } from "@/services/contactsConverter";

interface ContactsContextType {
  contacts: Contact[];
  addContact: (data: Omit<Contact, "id">) => Promise<void>;
  updateContact: (id: string, data: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
}

const ContactsContext = createContext<ContactsContextType>({
  contacts: [],
  addContact: async () => {},
  updateContact: async () => {},
  deleteContact: async () => {},
});

export const useContacts = () => useContext(ContactsContext);

export const ContactsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const q = query(collection(db, "contacts").withConverter(contactsConverter));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => doc.data());
        setContacts(docs);
      },
      (error) => {
        console.error("❌ Error al obtener contactos:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const addContact = async (data: Omit<Contact, "id">) => {
    await addDoc(collection(db, "contacts").withConverter(contactsConverter), {
      ...data,
      creadoEn: Date.now(),
    });
  };

  const updateContact = async (id: string, data: Partial<Contact>) => {
    const ref = doc(db, "contacts", id).withConverter(contactsConverter);
    await updateDoc(ref, data);
  };

  const deleteContact = async (id: string) => {
    const ref = doc(db, "contacts", id);
    await deleteDoc(ref);
  };

  return (
    <ContactsContext.Provider
      value={{ contacts, addContact, updateContact, deleteContact }}
    >
      {children}
    </ContactsContext.Provider>
  );
};
