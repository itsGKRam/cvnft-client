import { create } from "zustand";

const contractStore = (set) => ({
  contract: "0x41662cd483451A98E5af6471400791596026ff03",
});

const useContractStore = create(contractStore);

export default useContractStore;
