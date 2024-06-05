import React, { createContext, useContext, useState } from 'react';

interface UserContextType {
  userId: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: string | null; // Add role property
  branchCode: string | null;
  contact: string | null;
  signature: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  setFirstName: React.Dispatch<React.SetStateAction<string | null>>;
  setLastName: React.Dispatch<React.SetStateAction<string | null>>;
  setEmail: React.Dispatch<React.SetStateAction<string | null>>;
  setRole: React.Dispatch<React.SetStateAction<string | null>>; // Add setRole method
  setBranchCode: React.Dispatch<React.SetStateAction<string | null>>;
  setContact: React.Dispatch<React.SetStateAction<string | null>>;
  setSignature: React.Dispatch<React.SetStateAction<string | null>>;
  updateUser: (
    userId: string | null,
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    role: string | null, // Include role parameter
    branchCode: string | null,
    contact: string | null,
    signature: string | null
  ) => void;
}

const UserContext = createContext<UserContextType>({
  userId: null,
  firstName: null,
  lastName: null,
  email: null,
  role: null, // Initialize role as null
  branchCode: null,
  contact: null,
  signature: null,
  setUserId: () => {},
  setFirstName: () => {},
  setLastName: () => {},
  setEmail: () => {},
  setRole: () => {}, // Add setRole method
  setBranchCode: () => {},
  setContact: () => {},
  setSignature: () => {},
  updateUser: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // Add role state
  const [branchCode, setBranchCode] = useState<string | null>(null);
  const [contact, setContact] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const updateUser = (
    userId: string | null,
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    role: string | null, // Include role parameter
    branchCode: string | null,
    contact: string | null,
    signature: string | null
  ) => {
    setUserId(userId);
    setFirstName(firstName);
    setLastName(lastName);
    setEmail(email);
    setRole(role); // Update role state
    setBranchCode(branchCode);
    setContact(contact);
    setSignature(signature);
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        firstName,
        lastName,
        email,
        role, // Include role in the context value
        branchCode,
        contact,
        signature,
        setUserId,
        setFirstName,
        setLastName,
        setEmail,
        setRole, // Include setRole in the context value
        setBranchCode,
        setContact,
        setSignature,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
