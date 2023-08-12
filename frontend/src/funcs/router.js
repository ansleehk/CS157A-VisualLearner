
import { Outlet, createBrowserRouter } from "react-router-dom";

import Menu from "../components/menu";

import ReaderAndVisual from "../pages/reader&visual";
import ConceptSearchAndList from "../pages/concept/conceptSearch&List";
import FieldSearchAndList from "../pages/fields/fieldSearch&List";
import Reader from "../pages/reader";
import Visual from "../pages/visual";


import "../styles/main.scss"

const AppLayout = () => {
  return (
    <div id="entire-window">
      <Menu />
      <Outlet />
    </div>
  )
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <ReaderAndVisual />,
          },
          {
            path: "/reader&visual",
            element: <ReaderAndVisual />,
            children: [
              {
                path: ":defaultArticleId",
                element: <ReaderAndVisual />
              }
            ]
          },
          {
            path: "conceptSearch&List",
            element: <ConceptSearchAndList />,
            children: [
              {
                path: ":defaultConceptId",
                element: <ConceptSearchAndList />
              }
            ]
          },
          {
            path: "fieldSearch&List",
            element: <FieldSearchAndList />,
            children: [
              {
                path: ":defaultFieldId",
                element: <FieldSearchAndList />
              }
              ]
            }
        ]
    },
    {
      path: "component",
      children: [
        {
          path: "reader",
          element: <Reader />,
        },
        {
          path: "visual",
          element: <Visual />
        }
      ]
    }
  ]);

  export default router;
  
