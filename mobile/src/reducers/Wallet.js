'use strict'

import { WalletConstants } from 'actions/Wallet'

const initialState = {
  accounts: [],
  accountNameMapping: {},
  accountBalance: {
    eth: 0,
    dai: 0,
    ogn: 0
  },
  activeAccount: null,
  accountServerNotifications: {}
}

export default function Wallet(state = initialState, action = {}) {
  switch (action.type) {
    case WalletConstants.INIT_SUCCESS:
      return { ...state, address: action.address }

    case WalletConstants.ADD_ACCOUNT:
      const exists = state.accounts.find(
        a => a.address === action.account.address
      )
      if (!exists) {
        return {
          ...state,
          accounts: [action.account, ...state.accounts]
        }
      } else {
        return state
      }

    case WalletConstants.REMOVE_ACCOUNT:
      return {
        ...state,
        accounts: state.accounts.filter(
          a => a.address !== action.account.address
        )
      }

    case WalletConstants.SET_ACCOUNT_ACTIVE:
      // Remove the account from the accounts array
      return {
        ...state,
        activeAccount: action.account
      }

    case WalletConstants.SET_ACCOUNT_BALANCES:
      return {
        ...state,
        accountBalance: action.balances
      }

    case WalletConstants.SET_ACCOUNT_NAME:
      return {
        ...state,
        accountNameMapping: {
          ...state.accountNameMapping,
          [action.payload.address]: action.payload.name
        }
      }
  }

  return state
}
