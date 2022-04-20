<?php
namespace Stackfactory\SfSeolighthouse\ViewHelpers;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

/**
 * returns either $_GET (default) or $_POST global arrays or specific query parameter strings
 * returns false if getOrPost argument asks for something else
 * returns false if $_GET or $_POST are empty except when returnEmptyArray argument is set to true (default is false)
 *     example: {namespace:queryParameters(getOrPost: 'POST', returnEmptyArray: 'true')}
 *         returnEmptyArray must either be a lower-case string or 0/1
 * returns false if queryParam argument can not be found in the array
 * @return mixed
 */
class QueryParametersViewHelper extends AbstractViewHelper
{
    public function initializeArguments()
    {
        parent::initializeArguments();
        $this->registerArgument('getOrPost', 'string', 'Can be GET (default) or POST (case sensitive)', false, 'GET');
        $this->registerArgument('returnEmptyArray', 'boolean', 'true if you want an empty array to be returned instead of boolean false', false, false);
        $this->registerArgument('queryParam', 'string', 'add if you need to ask for a specific queryParam (for extension POST queryParams use “tx_yourext_yourplugin|queryParam”)', false, false);
    }

    /**
     * @return string
     */
    public function render()
    {
        $getOrPost = $this->arguments['getOrPost'];
        $returnEmptyArray = $this->arguments['returnEmptyArray'];
        $queryParam = $this->arguments['queryParam'];

        if ($getOrPost === 'GET') {
            $return = GeneralUtility::_GET();
        } elseif ($getOrPost === 'POST') {
            $return = GeneralUtility::_POST();
        } else {
            $return = false;
        }

        if (is_array($return) && (!empty($return) || $returnEmptyArray)) {
            /**
             * sanitise every value recursively
             */
            array_walk_recursive($return, function(&$val) {
                $val = htmlentities($val, ENT_QUOTES, 'UTF-8');
            });

            /**
             * return specific query parameter
             */
            if ($queryParam) {
                if (strstr($queryParam, '|')) {
                    $paramParts = explode('|', $queryParam);
                    $returnParam = $this->recursiveIsset($return, $paramParts);
                } else {
                    $returnParam = (isset($return[$queryParam])) ? $return[$queryParam] : false;
                }
                return $returnParam;
            }

            /**
             * return array
             */
            return $return;
        } else {
            return false;
        }
    }

    /**
     * checks for an array element in an array of unspecified dimension depth
     * and returns the value of that array element if found or false if not
     * @param array $getOrPost The array to look in
     * @param array $arrayDimensions An array of dimensional keys
     *     (e.g. ['dimA','dimB'] will check for $getOrPost['dimA'][dimB‘])
     * @return mixed
     *
     * taken from this stackoverflow answer: https://stackoverflow.com/a/11041473/4274248
     */
    private function recursiveIsset($getOrPost, $arrayDimensions, $i = 0)
    {
        $newGetOrPost = null;

        if (array_key_exists($arrayDimensions[$i], $getOrPost)) {
            $newGetOrPost = $getOrPost[$arrayDimensions[$i]];
        }

        if (!isset($newGetOrPost)) { // isset() returns false on an element that exists but is null
            return false;
        } elseif (count($arrayDimensions) > $i + 1) {
            return $this->recursiveIsset($newGetOrPost, $arrayDimensions, $i + 1);
        } else {
            return $newGetOrPost;
        }
    }
}
