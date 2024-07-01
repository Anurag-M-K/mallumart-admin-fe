import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';

// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

// Tailwind css
import './tailwind.css';

// i18n (needs to be bundled)
import './i18n';

// Router
import { RouterProvider } from 'react-router-dom';
import router from './router/index';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

// Redux
import { Provider } from 'react-redux';
import store from './store/index';

const queryClient = new QueryClient();

let persistor = persistStore(store);
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <>
        <QueryClientProvider client={queryClient}>
            <Suspense>
                <Provider store={store}>
                    <MantineProvider defaultColorScheme="light">
                        <PersistGate persistor={persistor}>
                            <RouterProvider router={router} />
                        </PersistGate>
                    </MantineProvider>
                </Provider>
            </Suspense>
        </QueryClientProvider>
    </>
);
